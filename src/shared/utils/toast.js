/**
 * Utility functions for toast notifications using react-hot-toast
 * Provides helper functions for common toast patterns with promises
 */

import toast from 'react-hot-toast';

/**
 * Show success toast
 * @param {string} message - Success message
 */
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

/**
 * Show error toast
 * @param {string} message - Error message
 */
export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

/**
 * Show loading toast
 * @param {string} message - Loading message
 * @returns {string} - Toast ID for updating
 */
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

/**
 * Handle promise with toast notifications
 * Automatically shows loading, success, and error states
 * 
 * @param {Promise} promise - The promise to handle
 * @param {Object} messages - Toast messages
 * @param {string} messages.loading - Loading message
 * @param {string|Function} messages.success - Success message (can be function that receives data)
 * @param {string|Function} messages.error - Error message (can be function that receives error)
 * @param {Object} options - Additional toast options
 * @returns {Promise} - The original promise
 * 
 * @example
 * toastPromise(
 *   CompanyAPI.create(values),
 *   {
 *     loading: 'Menyimpan data perusahaan...',
 *     success: 'Data perusahaan berhasil disimpan',
 *     error: (err) => `Gagal menyimpan data: ${err.message}`
 *   }
 * );
 */
export const toastPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Memproses...',
      success: messages.success || 'Berhasil!',
      error: messages.error || 'Terjadi kesalahan',
    },
    {
      position: 'top-right',
      duration: 4000,
      ...options,
    }
  );
};

/**
 * Handle create operation with toast
 * @param {Promise} promise - Create promise
 * @param {string} entityName - Entity name (e.g., 'perusahaan', 'role')
 * @returns {Promise}
 */
export const handleCreateWithToast = (promise, entityName) => {
  return toastPromise(
    promise,
    {
      loading: `Menyimpan data ${entityName}...`,
      success: `Data ${entityName} berhasil disimpan`,
      error: (err) => `Gagal menyimpan data ${entityName}: ${err.message || 'Terjadi kesalahan'}`,
    }
  );
};

/**
 * Handle update operation with toast
 * @param {Promise} promise - Update promise
 * @param {string} entityName - Entity name (e.g., 'perusahaan', 'role')
 * @returns {Promise}
 */
export const handleUpdateWithToast = (promise, entityName) => {
  return toastPromise(
    promise,
    {
      loading: `Memperbarui data ${entityName}...`,
      success: `Data ${entityName} berhasil diperbarui`,
      error: (err) => `Gagal memperbarui data ${entityName}: ${err.message || 'Terjadi kesalahan'}`,
    }
  );
};

/**
 * Handle delete operation with toast
 * @param {Promise} promise - Delete promise
 * @param {string} entityName - Entity name (e.g., 'perusahaan', 'role')
 * @param {string} itemName - Item name for success message
 * @returns {Promise}
 */
export const handleDeleteWithToast = (promise, entityName, itemName = '') => {
  return toastPromise(
    promise,
    {
      loading: `Menghapus data ${entityName}...`,
      success: itemName 
        ? `${entityName} "${itemName}" berhasil dihapus`
        : `Data ${entityName} berhasil dihapus`,
      error: (err) => `Gagal menghapus data ${entityName}: ${err.message || 'Terjadi kesalahan'}`,
    }
  );
};
