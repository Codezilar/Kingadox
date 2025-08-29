import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';
import { ObjectId } from 'mongodb';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '@/lib/cloudinary';

// Generate random 10-digit account number
const generateRandomAccountNumber = (): string => {
  const min = 1000000000;
  const max = 9999999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString();
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const clerkId = formData.get('clerkId') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const country = formData.get('country') as string;
    const state = formData.get('state') as string;
    const idCard = formData.get('idCardFileName') as File;
    const passport = formData.get('passportFileName') as File;

    // Validate required fields
    if (!clerkId || !firstName || !lastName || !email || !idCard || !passport) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // Validate files
    if (idCard.size === 0 || passport.size === 0) {
      return NextResponse.json(
        { error: "Please upload both ID card and passport" }, 
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if user already has a KYC record
    const existingKyc = await Kyc.findOne({ clerkId });

    let account = "";
    let balance = "0";
    let applied = "1";

    if (existingKyc) {
      account = existingKyc.account;
      balance = existingKyc.balance;
      applied = existingKyc.applied;
      
      // Delete old files from Cloudinary
      try {
        if (existingKyc.idCard) {
          const publicId = getPublicIdFromUrl(existingKyc.idCard);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        }
        if (existingKyc.passport) {
          const publicId = getPublicIdFromUrl(existingKyc.passport);
          if (publicId) {
            await deleteFromCloudinary(publicId);
          }
        }
      } catch (fileError) {
        console.error('Error deleting old files:', fileError);
        // Continue with upload even if deletion fails
      }
    } else {
      account = generateRandomAccountNumber();
    }

    // Sanitize filenames
    const sanitizeFilename = (filename: string) => {
      return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    };

    // Process ID card
    const idCardBuffer = Buffer.from(await idCard.arrayBuffer());
    const idCardSanitized = sanitizeFilename(idCard.name);
    const idCardFilename = `${clerkId}_idCard_${Date.now()}_${idCardSanitized}`;
    
    // Process passport
    const passportBuffer = Buffer.from(await passport.arrayBuffer());
    const passportSanitized = sanitizeFilename(passport.name);
    const passportFilename = `${clerkId}_passport_${Date.now()}_${passportSanitized}`;

    try {
      // Upload files to Cloudinary
      const [idCardUpload, passportUpload] = await Promise.all([
        uploadToCloudinary(idCardBuffer, 'id_cards', idCardFilename) as Promise<any>,
        uploadToCloudinary(passportBuffer, 'passports', passportFilename) as Promise<any>
      ]);

      // Update or create KYC record
      const kycData = {
        clerkId,
        firstName,
        lastName,
        email,
        country,
        state,
        account,
        approve: "0",
        balance,
        applied,
        idCard: idCardUpload.secure_url,
        passport: passportUpload.secure_url,
      };

      if (existingKyc) {
        await Kyc.findOneAndUpdate(
          { clerkId },
          kycData,
          { new: true, runValidators: true }
        );
      } else {
        await Kyc.create(kycData);
      }

      return NextResponse.json(
        { 
          message: existingKyc ? "KYC Re-application Submitted" : "KYC Request Submitted",
          accountNumber: account,
          isReapplication: !!existingKyc
        }, 
        { status: 201 }
      );
    } catch (fileError) {
      console.error('File upload error:', fileError);
      return NextResponse.json(
        { error: "Failed to upload files" }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('KYC submission error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((e: any) => ({
        field: e.path,
        message: e.message,
        value: e.value
      }));
      console.error('MongoDB Validation errors:', validationErrors);
      
      return NextResponse.json(
        { error: "Validation Failed", details: validationErrors }, 
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "KYC application already exists for this user" }, 
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

// GET method remains the same
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const kycData = await Kyc.find({}).sort({ createdAt: -1 }).lean();
    
    const serializedData = kycData.map(doc => ({
      clerkId: doc.clerkId,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      country: doc.country,
      state: doc.state,
      account: doc.account,
      approve: doc.approve || '0',
      balance: doc.balance || '0',
      idCard: doc.idCard,
      passport: doc.passport,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString()
    }));
    
    return NextResponse.json({ kyc: serializedData }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching KYC data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KYC data' },
      { status: 500 }
    );
  }
}