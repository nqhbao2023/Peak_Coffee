import toast from 'react-hot-toast';

/**
 * Global Error Handler cho Peak Coffee
 * Chuẩn hóa cách hiển thị lỗi cho người dùng
 * Thay vì mỗi context tự handle riêng, dùng utility này
 */

// Map error code → thông báo thân thiện (tiếng Việt)
const ERROR_MESSAGES = {
  'permission-denied': 'Bạn không có quyền thực hiện hành động này.',
  'not-found': 'Không tìm thấy dữ liệu.',
  'unavailable': 'Máy chủ đang bận, vui lòng thử lại sau.',
  'deadline-exceeded': 'Kết nối quá chậm, vui lòng thử lại.',
  'unauthenticated': 'Vui lòng đăng nhập để tiếp tục.',
  'already-exists': 'Dữ liệu đã tồn tại.',
  'resource-exhausted': 'Đã vượt quá giới hạn, thử lại sau.',
  'failed-precondition': 'Thao tác không hợp lệ.',
  'network-error': 'Lỗi mạng, kiểm tra kết nối internet.',
  default: 'Có lỗi xảy ra, vui lòng thử lại!',
};

/**
 * Lấy thông báo lỗi thân thiện
 * @param {Error} error - Error object
 * @param {string} fallback - Thông báo fallback (optional)
 * @returns {string}
 */
export const getErrorMessage = (error, fallback = null) => {
  if (!error) return fallback || ERROR_MESSAGES.default;

  // Firebase error codes
  if (error.code) {
    return ERROR_MESSAGES[error.code] || fallback || ERROR_MESSAGES.default;
  }

  // Network errors
  if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
    return ERROR_MESSAGES['network-error'];
  }

  return fallback || ERROR_MESSAGES.default;
};

/**
 * Hiển thị toast lỗi với chuẩn design
 * @param {Error} error - Error object
 * @param {string} context - Mô tả ngữ cảnh (vd: "tạo đơn hàng")
 */
export const showErrorToast = (error, context = '') => {
  const message = getErrorMessage(error);
  const fullMessage = context ? `Lỗi ${context}: ${message}` : message;

  console.error(`❌ [${context}]`, error);

  toast.error((t) => (
    <span
      onClick={() => toast.dismiss(t.id)}
      className="cursor-pointer text-sm font-medium"
    >
      {fullMessage}
    </span>
  ), {
    duration: 4000,
    position: 'top-center',
  });
};

/**
 * Wrapper cho async operations với error handling tự động
 * @param {Function} asyncFn - Hàm async cần wrap
 * @param {string} context - Mô tả ngữ cảnh
 * @returns {Promise} - Kết quả hoặc null nếu lỗi
 */
export const withErrorHandling = async (asyncFn, context = '') => {
  try {
    return await asyncFn();
  } catch (error) {
    showErrorToast(error, context);
    return null;
  }
};

export default {
  getErrorMessage,
  showErrorToast,
  withErrorHandling,
};
