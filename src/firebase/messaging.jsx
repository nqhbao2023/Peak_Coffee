// Firebase Cloud Messaging Helper
// Request permission và lưu FCM token

import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './config';
import { COLLECTIONS, updateDocument } from './firestore';
import toast from 'react-hot-toast';

// VAPID Key từ Firebase Console
// Docs: https://firebase.google.com/docs/cloud-messaging/js/client#configure_web_credentials_with_fcm
const VAPID_KEY = 'BLp-80PQjRbwMRW-TqM3jW1hsTV6rQk3rDSF6kAVIDJWt47IFnBdCkiF4Oz_bNqJvoRVFq0vlvZoTLfDukZv8_g'; // ⚠️ BẠN CẦN THAY ĐỔI KEY NÀY

/**
 * Request notification permission từ user
 * @returns {Promise<boolean>} - true nếu được phép
 */
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.warn('⚠️ Browser không hỗ trợ notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission đã được cấp');
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('⚠️ Notification permission bị từ chối');
      toast.error('Bạn đã chặn thông báo. Vui lòng bật lại trong cài đặt trình duyệt!');
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Notification permission đã được cấp');
      toast.success('🔔 Đã bật thông báo đơn hàng mới!');
      return true;
    } else {
      console.warn('⚠️ User từ chối notification permission');
      return false;
    }
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Lấy FCM token và lưu vào Firestore user profile
 * @param {string} userId - User ID (phone number)
 * @returns {Promise<string|null>} - FCM token hoặc null nếu lỗi
 */
export const getFCMToken = async (userId) => {
  try {
    if (!messaging) {
      console.warn('⚠️ Firebase Messaging không khả dụng');
      return null;
    }

    // Request permission trước
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return null;
    }

    // Đăng ký Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service Worker registered:', registration);

    // Lấy FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log('✅ FCM Token:', token);

      // Lưu token vào Firestore user profile
      await updateDocument(COLLECTIONS.USERS, userId, {
        fcmToken: token,
        fcmTokenUpdatedAt: new Date().toISOString(),
      });

      return token;
    } else {
      console.warn('⚠️ Không thể lấy FCM token');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    
    // Hướng dẫn user nếu lỗi
    if (error.code === 'messaging/permission-blocked') {
      toast.error('⚠️ Thông báo bị chặn. Vui lòng bật trong cài đặt trình duyệt!');
    }
    
    return null;
  }
};

/**
 * Setup listener cho foreground messages (khi app đang mở)
 */
export const setupForegroundMessaging = () => {
  if (!messaging) {
    console.warn('⚠️ Firebase Messaging không khả dụng');
    return null;
  }

  // Listen messages khi app đang mở
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('📩 Foreground message received:', payload);

    // Hiển thị toast notification
    const title = payload.notification?.title || 'Thông báo mới';
    const body = payload.notification?.body || '';

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-2 border-orange-500`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-2xl">🔔</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-black text-stone-900">{title}</p>
                <p className="mt-1 text-sm text-stone-600">{body}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-stone-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-orange-600 hover:bg-orange-50 focus:outline-none"
            >
              Đóng
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: 'top-right',
      }
    );

    // Play sound (optional)
    if (payload.data?.playSound !== 'false') {
      playNotificationSound();
    }

    // Vibrate (nếu browser hỗ trợ)
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  });

  return unsubscribe;
};

/**
 * Play notification sound
 */
const playNotificationSound = () => {
  try {
    // Bạn có thể thêm file audio vào public/sounds/
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.warn('⚠️ Cannot play notification sound:', err);
    });
  } catch (error) {
    console.warn('⚠️ Error playing sound:', error);
  }
};

/**
 * Delete FCM token (khi logout)
 * @param {string} userId - User ID
 */
export const deleteFCMToken = async (userId) => {
  try {
    await updateDocument(COLLECTIONS.USERS, userId, {
      fcmToken: null,
      fcmTokenUpdatedAt: new Date().toISOString(),
    });
    console.log('✅ FCM token deleted');
  } catch (error) {
    console.error('❌ Error deleting FCM token:', error);
  }
};
