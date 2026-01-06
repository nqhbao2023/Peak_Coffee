import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  COLLECTIONS, 
  getDocument, 
  setDocument, 
  updateDocument,
} from '../firebase/firestore';

const AuthContext = createContext();

// Admin phone number (có thể thay đổi)
const ADMIN_PHONE = '0982349213';

// LocalStorage key cho current user (để auto-login)
const USER_KEY = 'peak_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user từ LocalStorage khi app khởi động (auto-login)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem(USER_KEY);
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Verify với Firestore (case user bị xóa khỏi DB)
          const firestoreUser = await getDocument(COLLECTIONS.USERS, userData.phone);
          
          if (firestoreUser) {
            setUser(firestoreUser);
            setIsAdmin(firestoreUser.phone === ADMIN_PHONE);
            
            // Update lastLogin trong Firestore
            await updateDocument(COLLECTIONS.USERS, userData.phone, {
              lastLoginAt: new Date().toISOString(),
            });
          } else {
            // User không còn tồn tại trong Firestore
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Kiểm tra số điện thoại đã đăng ký chưa (check Firestore)
  const isPhoneRegistered = async (phone) => {
    try {
      const user = await getDocument(COLLECTIONS.USERS, phone);
      return !!user;
    } catch (error) {
      console.error('❌ Error checking phone:', error);
      return false;
    }
  };

  // Lấy thông tin user từ số điện thoại (từ Firestore)
  const getUserByPhone = async (phone) => {
    try {
      return await getDocument(COLLECTIONS.USERS, phone);
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  };

  // Đăng ký (lần đầu): cần tên + SĐT (sync Firestore)
  const register = async (phone, name) => {
    try {
      // Kiểm tra xem đã đăng ký chưa
      const existingUser = await getDocument(COLLECTIONS.USERS, phone);
      
      if (existingUser) {
        return { success: false, message: 'Số điện thoại đã được đăng ký!' };
      }

      // Tạo user mới trong Firestore (dùng phone làm document ID)
      const newUser = {
        phone,
        name,
        isAdmin: phone === ADMIN_PHONE,
        loyaltyPoints: 0,
        loyaltyVouchers: 0,
        streakDays: 0,
        lastOrderDate: null,
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      await setDocument(COLLECTIONS.USERS, phone, newUser);

      // Login luôn
      setUser(newUser);
      setIsAdmin(phone === ADMIN_PHONE);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));

      // Không toast ở đây nữa - để LoginModal handle
      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Error registering:', error);
      toast.error('Lỗi khi đăng ký. Vui lòng thử lại!');
      return { success: false, message: 'Lỗi hệ thống!' };
    }
  };

  // Đăng nhập (lần sau): chỉ cần SĐT (check Firestore)
  const login = async (phone) => {
    try {
      const existingUser = await getDocument(COLLECTIONS.USERS, phone);
      
      if (!existingUser) {
        return { success: false, message: 'Số điện thoại chưa được đăng ký!' };
      }

      // Cập nhật lastLogin
      await updateDocument(COLLECTIONS.USERS, phone, {
        lastLoginAt: new Date().toISOString(),
      });

      // Login
      const userData = { ...existingUser, lastLoginAt: new Date().toISOString() };
      setUser(userData);
      setIsAdmin(phone === ADMIN_PHONE);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Không toast ở đây nữa - để LoginModal handle
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Error logging in:', error);
      toast.error('Lỗi khi đăng nhập. Vui lòng thử lại!');
      return { success: false, message: 'Lỗi hệ thống!' };
    }
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem(USER_KEY);
    toast.success('👋 Đã đăng xuất!');
  };

  const value = {
    user,
    isAdmin,
    isLoading,
    register,
    login,
    logout,
    isLoggedIn: !!user,
    isPhoneRegistered,
    getUserByPhone,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
