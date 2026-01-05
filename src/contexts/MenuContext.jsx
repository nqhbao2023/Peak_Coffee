import React, { createContext, useContext, useState, useEffect } from 'react';
import { MENU_DATA } from '../data/menu';
import { v4 as uuidv4 } from 'uuid';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);

  // Load menu từ LocalStorage hoặc dùng default
  useEffect(() => {
    const savedMenu = localStorage.getItem('peak_menu');
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      // First time: Load từ MENU_DATA và thêm isAvailable
      const initialMenu = MENU_DATA.map(item => ({
        ...item,
        isAvailable: true,
        createdAt: new Date().toISOString(),
      }));
      setMenuItems(initialMenu);
      localStorage.setItem('peak_menu', JSON.stringify(initialMenu));
    }
  }, []);

  // Lưu vào LocalStorage mỗi khi thay đổi
  useEffect(() => {
    if (menuItems.length > 0) {
      localStorage.setItem('peak_menu', JSON.stringify(menuItems));
    }
  }, [menuItems]);

  // Thêm món mới
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: parseInt(Date.now().toString().slice(-8)), // Tạo ID unique
      isAvailable: true,
      createdAt: new Date().toISOString(),
    };
    setMenuItems(prev => [...prev, newItem]);
    return newItem;
  };

  // Cập nhật món
  const updateMenuItem = (id, updates) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
  };

  // Xóa món
  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // Toggle available
  const toggleAvailability = (id) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Get categories
  const getCategories = () => {
    const categories = menuItems.map(item => item.category);
    return ['Tất cả', ...new Set(categories)];
  };

  // Get items by category
  const getItemsByCategory = (category) => {
    if (category === 'Tất cả') return menuItems;
    return menuItems.filter(item => item.category === category);
  };

  // Reset về default
  const resetMenu = () => {
    const defaultMenu = MENU_DATA.map(item => ({
      ...item,
      isAvailable: true,
      createdAt: new Date().toISOString(),
    }));
    setMenuItems(defaultMenu);
    localStorage.setItem('peak_menu', JSON.stringify(defaultMenu));
  };

  const value = {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getCategories,
    getItemsByCategory,
    resetMenu,
  };

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
