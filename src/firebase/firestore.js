// Firestore Helper Functions
// Các hàm tiện ích để tương tác với Firestore dễ dàng hơn

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ============================================
// COLLECTIONS REFERENCES
// ============================================

export const COLLECTIONS = {
  USERS: 'users',
  MENU: 'menu',
  ORDERS: 'orders',
  CUSTOMERS: 'customers', // Cho debt management
  DEBT_ORDERS: 'debt_orders', // Orders ghi nợ
  DEBT_TRANSACTIONS: 'debt_transactions', // Lịch sử giao dịch nợ
  SETTINGS: 'settings',
};

// ============================================
// GENERIC CRUD OPERATIONS
// ============================================

/**
 * Tạo document mới với auto-generated ID
 * @param {string} collectionName - Tên collection
 * @param {object} data - Dữ liệu để lưu
 * @returns {Promise<string>} - Document ID
 */
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`❌ Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Tạo/Overwrite document với custom ID
 * @param {string} collectionName - Tên collection
 * @param {string} docId - Document ID
 * @param {object} data - Dữ liệu để lưu
 */
export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`❌ Error setting document ${docId}:`, error);
    throw error;
  }
};

/**
 * Đọc 1 document theo ID
 * @param {string} collectionName - Tên collection
 * @param {string} docId - Document ID
 * @returns {Promise<object|null>} - Document data hoặc null nếu không tồn tại
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error(`❌ Error getting document ${docId}:`, error);
    throw error;
  }
};

/**
 * Đọc tất cả documents trong collection
 * @param {string} collectionName - Tên collection
 * @returns {Promise<Array>} - Mảng documents
 */
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`❌ Error getting all documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update document (merge mode)
 * @param {string} collectionName - Tên collection
 * @param {string} docId - Document ID
 * @param {object} updates - Các field cần update
 */
export const updateDocument = async (collectionName, docId, updates) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`❌ Error updating document ${docId}:`, error);
    throw error;
  }
};

/**
 * Xóa document
 * @param {string} collectionName - Tên collection
 * @param {string} docId - Document ID
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`❌ Error deleting document ${docId}:`, error);
    throw error;
  }
};

// ============================================
// QUERY OPERATIONS
// ============================================

/**
 * Query documents với điều kiện
 * @param {string} collectionName - Tên collection
 * @param {Array} conditions - Array of [field, operator, value]
 * @param {string} orderByField - Field để sort (optional)
 * @param {number} limitCount - Giới hạn số lượng (optional)
 * @returns {Promise<Array>} - Mảng documents
 */
export const queryDocuments = async (
  collectionName,
  conditions = [],
  orderByField = null,
  limitCount = null
) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply conditions
    const constraints = [];
    conditions.forEach(([field, operator, value]) => {
      constraints.push(where(field, operator, value));
    });
    
    // Apply orderBy
    if (orderByField) {
      constraints.push(orderBy(orderByField, 'desc'));
    }
    
    // Apply limit
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`❌ Error querying ${collectionName}:`, error);
    throw error;
  }
};

// ============================================
// REALTIME LISTENERS
// ============================================

/**
 * Listen realtime changes trên collection
 * @param {string} collectionName - Tên collection
 * @param {Function} callback - Function nhận dữ liệu mới (data) => {}
 * @param {Array} conditions - Query conditions (optional)
 * @returns {Function} - Unsubscribe function
 */
export const listenToCollection = (collectionName, callback, conditions = []) => {
  try {
    let q = collection(db, collectionName);
    
    if (conditions.length > 0) {
      const constraints = conditions.map(([field, operator, value]) =>
        where(field, operator, value)
      );
      q = query(q, ...constraints);
    }
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      },
      (error) => {
        console.error(`❌ Error listening to ${collectionName}:`, error);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error(`❌ Error setting up listener:`, error);
    throw error;
  }
};

/**
 * Listen realtime changes trên 1 document
 * @param {string} collectionName - Tên collection
 * @param {string} docId - Document ID
 * @param {Function} callback - Function nhận dữ liệu mới (data) => {}
 * @returns {Function} - Unsubscribe function
 */
export const listenToDocument = (collectionName, docId, callback) => {
  try {
    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (snapshot) => {
        if (snapshot.exists()) {
          callback({ id: snapshot.id, ...snapshot.data() });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`❌ Error listening to document ${docId}:`, error);
      }
    );
    
    return unsubscribe;
  } catch (error) {
    console.error(`❌ Error setting up document listener:`, error);
    throw error;
  }
};

// ============================================
// TIMESTAMP HELPERS
// ============================================

/**
 * Convert Firestore Timestamp sang JavaScript Date
 * @param {Timestamp} timestamp - Firestore Timestamp
 * @returns {Date|null}
 */
export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  // Fallback cho ISO string
  return new Date(timestamp);
};

/**
 * Convert JavaScript Date sang Firestore Timestamp
 * @param {Date} date - JavaScript Date
 * @returns {Timestamp}
 */
export const dateToTimestamp = (date) => {
  return Timestamp.fromDate(date);
};

/**
 * Lấy server timestamp hiện tại (dùng cho createdAt/updatedAt)
 */
export { serverTimestamp };

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Seed initial data vào collection (dùng 1 lần)
 * @param {string} collectionName - Tên collection
 * @param {Array} dataArray - Mảng objects để seed
 */
export const seedCollection = async (collectionName, dataArray) => {
  try {
    const promises = dataArray.map((data, index) => {
      // Dùng index làm ID hoặc data.id nếu có
      const docId = data.id?.toString() || index.toString();
      return setDocument(collectionName, docId, data);
    });
    
    await Promise.all(promises);
    console.log(`✅ Seeded ${dataArray.length} documents to ${collectionName}`);
  } catch (error) {
    console.error(`❌ Error seeding ${collectionName}:`, error);
    throw error;
  }
};
