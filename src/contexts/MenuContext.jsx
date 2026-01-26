import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { MENU_DATA } from '../data/menu';
import toast from 'react-hot-toast';
import {
  COLLECTIONS,
  getAllDocuments,
  setDocument,
  updateDocument,
  deleteDocument,
  listenToCollection,
  seedCollection,
} from '../firebase/firestore';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load menu từ Firestore với realtime listener
  useEffect(() => {
    let unsubscribe;

    const initMenu = async () => {
      try {
        setIsLoading(true);

        // Kiểm tra xem Firestore có data chưa
        const firestoreMenu = await getAllDocuments(COLLECTIONS.MENU);

        if (firestoreMenu.length === 0) {
          // Lần đầu tiên: Seed data từ MENU_DATA
          console.log('🌱 Seeding menu data to Firestore...');
          const initialMenu = MENU_DATA.map(item => ({
            ...item,
            isAvailable: true,
            createdAt: new Date().toISOString(),
          }));

          await seedCollection(COLLECTIONS.MENU, initialMenu);
          toast.success('✅ Menu đã được khởi tạo!');
        } else {
          // AUTO-PATCH: Nếu tìm thấy item trong MENU_DATA mà chưa có trong Firestore (theo ID), tự động thêm vào
          // Đây là cách "lazy update" cho data
          const existingIds = firestoreMenu.map(i => parseInt(i.id));
          const newItems = MENU_DATA.filter(i => !existingIds.includes(i.id));

          if (newItems.length > 0) {
            console.log(`🌱 Found ${newItems.length} new items in code, adding to Firestore...`);
            newItems.forEach(async (item) => {
              await setDocument(COLLECTIONS.MENU, item.id.toString(), {
                ...item,
                isAvailable: true,
                createdAt: new Date().toISOString(),
              });
            });
            // Update local state immediately to show new items (optional, listener will catch it too)
            // But listener is faster.
          }
        }

        // Setup realtime listener
        unsubscribe = listenToCollection(COLLECTIONS.MENU, (data) => {
          // Sort by ID để giữ thứ tự nhất quán
          const sortedData = data.sort((a, b) =>
            parseInt(a.id) - parseInt(b.id)
          );
          setMenuItems(sortedData);
          setIsLoading(false);
        });

      } catch (error) {
        console.error('❌ Error initializing menu:', error);
        toast.error('Lỗi khi tải menu. Vui lòng refresh lại!');

        // Fallback: Load từ localStorage nếu Firestore lỗi
        const savedMenu = localStorage.getItem('peak_menu');
        if (savedMenu) {
          setMenuItems(JSON.parse(savedMenu));
        } else {
          // Last resort: Use MENU_DATA
          const fallbackMenu = MENU_DATA.map(item => ({
            ...item,
            isAvailable: true,
            createdAt: new Date().toISOString(),
          }));
          setMenuItems(fallbackMenu);
        }
        setIsLoading(false);
      }
    };

    initMenu();

    // Cleanup listener khi unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Backup vào localStorage (fallback khi offline)
  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('peak_menu', JSON.stringify(menuItems));
    }
  }, [menuItems]);

  // Thêm món mới (sync với Firestore)
  const addMenuItem = async (item) => {
    try {
      setIsSyncing(true);
      const newItem = {
        ...item,
        id: parseInt(Date.now().toString().slice(-8)), // Tạo ID unique
        isAvailable: true,
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore (listener sẽ tự động update state)
      await setDocument(COLLECTIONS.MENU, newItem.id.toString(), newItem);

      toast.success('✅ Đã thêm món mới!');
      return newItem;
    } catch (error) {
      console.error('❌ Error adding menu item:', error);
      toast.error('Lỗi khi thêm món. Vui lòng thử lại!');
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Cập nhật món (sync với Firestore)
  const updateMenuItem = async (id, updates) => {
    try {
      setIsSyncing(true);
      await updateDocument(COLLECTIONS.MENU, id.toString(), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      toast.success('✅ Đã cập nhật món!');
    } catch (error) {
      console.error('❌ Error updating menu item:', error);
      toast.error('Lỗi khi cập nhật. Vui lòng thử lại!');
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Xóa món (sync với Firestore)
  const deleteMenuItem = async (id) => {
    try {
      setIsSyncing(true);
      await deleteDocument(COLLECTIONS.MENU, id.toString());

      toast.success('✅ Đã xóa món!');
    } catch (error) {
      console.error('❌ Error deleting menu item:', error);
      toast.error('Lỗi khi xóa. Vui lòng thử lại!');
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle available (sync với Firestore)
  const toggleAvailability = async (id) => {
    try {
      const item = menuItems.find(i => i.id === id);
      if (!item) return;

      setIsSyncing(true);
      await updateDocument(COLLECTIONS.MENU, id.toString(), {
        isAvailable: !item.isAvailable,
      });

      // Toast thông báo
      const message = !item.isAvailable ? 'Đã bật món' : 'Đã tắt món';
      toast.success(`✅ ${message}: ${item.name}`);
    } catch (error) {
      console.error('❌ Error toggling availability:', error);
      toast.error('Lỗi khi cập nhật. Vui lòng thử lại!');
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Get categories - memoized for stable reference
  const getCategories = useCallback(() => {
    const categories = menuItems.map(item => item.category);
    return ['Tất cả', ...new Set(categories)];
  }, [menuItems]);

  // Get items by category - memoized for stable reference
  const getItemsByCategory = useCallback((category) => {
    if (category === 'Tất cả') return menuItems;
    return menuItems.filter(item => item.category === category);
  }, [menuItems]);

  // Reset về default (re-seed Firestore)
  const resetMenu = async () => {
    try {
      setIsSyncing(true);
      const defaultMenu = MENU_DATA.map(item => ({
        ...item,
        isAvailable: true,
        createdAt: new Date().toISOString(),
      }));

      // Xóa hết và seed lại
      await seedCollection(COLLECTIONS.MENU, defaultMenu);

      toast.success('✅ Đã reset menu về mặc định!');
    } catch (error) {
      console.error('❌ Error resetting menu:', error);
      toast.error('Lỗi khi reset menu!');
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    menuItems,
    isLoading,
    isSyncing,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getCategories,
    getItemsByCategory,
    resetMenu,
  }), [menuItems, isLoading, isSyncing, getCategories, getItemsByCategory]);

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
};
