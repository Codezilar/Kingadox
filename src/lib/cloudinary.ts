import { v2 as cloudinary } from 'cloudinary';

// Validate environment variables
const validateCloudinaryConfig = () => {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY', 
    'CLOUDINARY_API_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const errorMessage = `Missing Cloudinary environment variables: ${missingVars.join(', ')}`;
    console.error('❌', errorMessage);
    throw new Error(errorMessage);
  }

  return true;
};

// Configure Cloudinary
const configureCloudinary = () => {
  try {
    if (validateCloudinaryConfig()) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
        secure: true
      });
      console.log('✅ Cloudinary configured successfully');
    }
  } catch (error) {
    console.error('❌ Cloudinary configuration failed:', error);
    throw error;
  }
};

// Initialize configuration
configureCloudinary();

export const uploadToCloudinary = async (
  file: Buffer, 
  folder: string, 
  filename: string
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const publicId = `kyc_${folder}_${timestamp}_${randomString}`;

    console.log(`📤 Uploading to Cloudinary: ${folder}/${publicId}`);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `kyc/${folder}`,
          public_id: publicId,
          overwrite: true,
          resource_type: 'auto',
          timeout: 30000, // 30 second timeout
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            console.log('✅ Cloudinary upload successful');
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id
            });
          } else {
            reject(new Error('Cloudinary upload returned no result'));
          }
        }
      );
      
      uploadStream.on('error', (error) => {
        console.error('❌ Upload stream error:', error);
        reject(error);
      });
      
      uploadStream.end(file);
    });
  } catch (error) {
    console.error('❌ Upload function error:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string | null): Promise<{ result: string }> => {
  try {
    // Validate publicId
    if (!publicId || typeof publicId !== 'string' || publicId.trim() === '') {
      console.warn('⚠️ Invalid publicId provided for deletion');
      return { result: 'noop' };
    }

    console.log(`🗑️ Attempting to delete from Cloudinary: ${publicId}`);
    
    const result = await cloudinary.uploader.destroy(publicId, {
      timeout: 15000
    });
    
    console.log(`🗑️ Deletion result for ${publicId}:`, result.result);
    
    return result;
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    // Return success to prevent blocking the main process
    return { result: 'ok' };
  }
};

export const getPublicIdFromUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  try {
    // Remove URL parameters and extract public ID
    const cleanUrl = url.split('?')[0];
    
    // Match various Cloudinary URL patterns
    const patterns = [
      /\/upload\/.*\/(v\d+\/)?([^\/\.]+)/,
      /\/image\/upload\/.*\/(v\d+\/)?([^\/\.]+)/,
      /\/v\d+\/([^\/\.]+)/,
      /\/([^\/\.]+)\.(jpg|jpeg|png|pdf)$/i
    ];
    
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match && match[2]) {
        return match[2];
      }
      if (match && match[1]) {
        return match[1];
      }
    }
    
    console.warn('⚠️ Could not extract publicId from URL:', url);
    return null;
  } catch (error) {
    console.error('❌ Error extracting publicId:', error);
    return null;
  }
};

// Utility function to check Cloudinary connection
export const testCloudinaryConnection = async (): Promise<boolean> => {
  try {
    await cloudinary.api.ping();
    console.log('✅ Cloudinary connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:', error);
    return false;
  }
};