// src/app/api/kyc/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { ObjectId } from 'mongodb';

// Generate random 10-digit account number
const generateRandomAccountNumber = (): string => {
  const min = 1000000000;
  const max = 9999999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber.toString();
};


// ... existing imports ...

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const clerkId = formData.get('clerkId') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const country = formData.get('country') as string;
    const state = formData.get('state') as string;
    const idCard = formData.get('idCardFileName') as File; // Fixed field name
    const passport = formData.get('passportFileName') as File; // Fixed field name

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
      
      // Delete old files
      try {
        if (existingKyc.idCard) {
          const oldIdCardPath = path.join(process.cwd(), 'public', existingKyc.idCard);
          await unlink(oldIdCardPath).catch(() => {}); // Ignore errors if file doesn't exist
        }
        if (existingKyc.passport) {
          const oldPassportPath = path.join(process.cwd(), 'public', existingKyc.passport);
          await unlink(oldPassportPath).catch(() => {}); // Ignore errors if file doesn't exist
        }
      } catch (fileError) {
        console.error('Error deleting old files:', fileError);
      }
    } else {
      account = generateRandomAccountNumber();
    }

    // Handle file uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (dirError) {
      console.error('Error creating upload directory:', dirError);
      return NextResponse.json(
        { error: "Server configuration error" }, 
        { status: 500 }
      );
    }

    // Sanitize filenames
    const sanitizeFilename = (filename: string) => {
      return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    };

    // Process ID card
    const idCardBuffer = Buffer.from(await idCard.arrayBuffer());
    const idCardSanitized = sanitizeFilename(idCard.name);
    const idCardFilename = `${Date.now()}_${idCardSanitized}`;
    const idCardPath = path.join(uploadDir, idCardFilename);
    
    // Process passport
    const passportBuffer = Buffer.from(await passport.arrayBuffer());
    const passportSanitized = sanitizeFilename(passport.name);
    const passportFilename = `${Date.now()}_${passportSanitized}`;
    const passportPath = path.join(uploadDir, passportFilename);

    try {
      await Promise.all([
        writeFile(idCardPath, idCardBuffer),
        writeFile(passportPath, passportBuffer)
      ]);
    } catch (fileError) {
      console.error('File write error:', fileError);
      return NextResponse.json(
        { error: "Failed to upload files" }, 
        { status: 500 }
      );
    }

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
      idCard: `/uploads/${idCardFilename}`,
      passport: `/uploads/${passportFilename}`,
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
  } catch (error: any) { // Added type annotation
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



export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    
    // Fetch all KYC documents using Mongoose
    const kycData = await Kyc.find({}).sort({ createdAt: -1 }).lean();
    
    // Convert Mongoose documents to plain objects
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