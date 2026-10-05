/**
 * Cloudinary Integration Utilities
 * Handles direct unsigned image uploads to Cloudinary CDN
 * and image URL optimization.
 */

// Default Cloudinary configuration (Users can override from the Admin Manager UI)
export const DEFAULT_CLOUDINARY_CONFIG = {
  cloudName: 'lujbdfel',
  uploadPreset: 'zioigfj8'
};

/**
 * Upload an image file directly to Cloudinary via Unsigned Upload Preset API
 * @param {File} file - The image file selected from an <input type="file">
 * @param {string} cloudName - Cloudinary Cloud Name
 * @param {string} uploadPreset - Unsigned Upload Preset Name
 * @returns {Promise<{ success: boolean, url?: string, publicId?: string, error?: string }>}
 */
export async function uploadToCloudinary(file, cloudName, uploadPreset) {
  if (!file) {
    return { success: false, error: 'No image file provided' };
  }
  if (!cloudName || !uploadPreset) {
    return {
      success: false,
      error: 'Cloud Name and Upload Preset are required. Please configure your Cloudinary credentials in Admin Settings.'
    };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok && data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        width: data.width,
        height: data.height
      };
    } else {
      const errMsg = data.error?.message || 'Failed to upload image to Cloudinary';
      return { success: false, error: errMsg };
    }
  } catch (err) {
    return { success: false, error: err.message || 'Network error while connecting to Cloudinary' };
  }
}

/**
 * Transforms a Cloudinary URL to add auto format, quality optimization, and resizing
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - { width, height, crop }
 * @returns {string} - Transformed Cloudinary URL
 */
export function getCloudinaryOptimizedUrl(url, { width = 600, height = 600, crop = 'fill' } = {}) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url;
  }

  // Insert transformations into Cloudinary URL: .../upload/f_auto,q_auto,c_fill,w_600,h_600/v1234/...
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const transformations = `f_auto,q_auto,c_${crop},w_${width},h_${height}`;
  return `${url.slice(0, uploadIndex + 8)}${transformations}/${url.slice(uploadIndex + 8)}`;
}
