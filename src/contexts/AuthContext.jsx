import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Admin phone number (có thể thay đổi)
const ADMIN_PHONE = '1111111111';

// LocalStorage keys
const USER_KEY = 'peak_user'; // Current logged-in user
const USERS_DB_KEY = 'peak_users_db'; // Database of all registered users

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load user từ LocalStorage khi app khởi động (auto-login)
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAdmin(userData.phone === ADMIN_PHONE);
    }
  }, []);

  // Lấy danh sách users đã đăng ký
  const getUsersDB = () => {
    const db = localStorage.getItem(USERS_DB_KEY);
    return db ? JSON.parse(db) : {};
  };

  // Lưu user vào database
  const saveUserToDB = (phone, name) => {
    const usersDB = getUsersDB();
    usersDB[phone] = {
      phone,
      name,
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDB));
  };

  // Cập nhật lastLogin
  const updateLastLogin = (phone) => {
    const usersDB = getUsersDB();
    if (usersDB[phone]) {
      usersDB[phone].lastLoginAt = new Date().toISOString();
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDB));
    }
  };

  // Kiểm tra số điện thoại đã đăng ký chưa
  const isPhoneRegistered = (phone) => {
    const usersDB = getUsersDB();
    return usersDB.hasOwnProperty(phone);
  };

  // Lấy thông tin user từ số điện thoại
  const getUserByPhone = (phone) => {
    const usersDB = getUsersDB();
    return usersDB[phone] || null;
  };

  // Đăng ký (lần đầu): cần tên + SĐT
  const register = (phone, name) => {
    if (isPhoneRegistered(phone)) {
      return { success: false, message: 'Số điện thoại đã được đăng ký!' };
    }

    // Lưu vào database
    saveUserToDB(phone, name);

    // Login luôn
    const userData = { phone, name };
    setUser(userData);
    setIsAdmin(phone === ADMIN_PHONE);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    return { success: true };
  };

  // Đăng nhập (lần sau): chỉ cần SĐT
  const login = (phone) => {
    const existingUser = getUserByPhone(phone);
    
    if (!existingUser) {
      return { success: false, message: 'Số điện thoại chưa được đăng ký!' };
    }

    // Cập nhật lastLogin
    updateLastLogin(phone);

    // Login
    const userData = { phone: existingUser.phone, name: existingUser.name };
    setUser(userData);
    setIsAdmin(phone === ADMIN_PHONE);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));

    return { success: true, user: userData };
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem(USER_KEY);
  };

  const value = {
    user,
    isAdmin,
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
