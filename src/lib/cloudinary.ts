// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Debug: Log the environment variables (but don't expose the secret)
console.log('Cloudinary config - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT_SET');
console.log('Cloudinary config - API Key:', process.env.CLOUDINARY_API_KEY || 'NOT_SET');
console.log('Cloudinary config - API Secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET');

// Check if we're in a server environment
const isServer = typeof window === 'undefined';

if (isServer) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Missing CLOUDINARY_CLOUD_NAME environment variable');
  } else if (process.env.CLOUDINARY_CLOUD_NAME === 'Root') {
    console.error('❌ CLOUDINARY_CLOUD_NAME is set to "Root" - this is likely incorrect');
  }

  if (!process.env.CLOUDINARY_API_KEY) {
    console.error('❌ Missing CLOUDINARY_API_KEY environment variable');
  }

  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Missing CLOUDINARY_API_SECRET environment variable');
  }
}

// Configure Cloudinary with explicit values
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
};

console.log('Final Cloudinary config:', {
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret ? 'SET' : 'MISSING',
});

cloudinary.config(config);

export const uploadToCloudinary = async (file: Buffer, folder: string, filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Remove file extension for public_id
    const publicId = filename.replace(/\.[^/.]+$/, "");
    
    console.log(`Uploading to Cloudinary: folder=kyc/${folder}, public_id=${publicId}`);
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `kyc/${folder}`,
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload successful:', result?.secure_url);
          resolve(result);
        }
      }
    );
    
    uploadStream.end(file);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    console.log(`Deleting from Cloudinary: public_id=${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    if (!url) return null;
    
    // Handle different Cloudinary URL formats
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex !== -1 && uploadIndex + 1 < pathParts.length) {
      // Get the part after upload/version/
      const versionIndex = pathParts.findIndex(part => part.startsWith('v'));
      if (versionIndex !== -1 && versionIndex + 1 < pathParts.length) {
        const publicIdWithExtension = pathParts.slice(versionIndex + 1).join('/');
        return publicIdWithExtension.replace(/\.[^/.]+$/, "");
      }
    }
    
    // Fallback: try to extract using regex
    const matches = url.match(/\/upload\/[^/]+\/(.+)\.\w+$/);
    return matches ? matches[1].replace(/\.[^/.]+$/, "") : null;
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error, url);
    return null;
  }
};