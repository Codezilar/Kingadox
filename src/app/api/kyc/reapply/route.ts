// app/api/kyc/reapply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Kyc from '@/models/kyc';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const clerkId = formData.get('clerkId') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const country = formData.get('country') as string;
    const state = formData.get('state') as string;
    const idCard = formData.get('idCard') as File;
    const passport = formData.get('passport') as File;

    // Validate required fields
    if (!clerkId || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    // Find existing KYC record
    const existingKyc = await Kyc.findOne({ clerkId });
    if (!existingKyc) {
      return NextResponse.json(
        { error: "KYC record not found" }, 
        { status: 404 }
      );
    }

    // Reset approval status when reapplying
    existingKyc.approve = 0;
    existingKyc.applied = 1;
    existingKyc.firstName = firstName;
    existingKyc.lastName = lastName;
    existingKyc.email = email;
    existingKyc.country = country;
    existingKyc.state = state;

    // Handle file uploads if new files are provided
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    if (idCard && idCard.size > 0) {
      // Remove old ID card file if it exists
      if (existingKyc.idCard) {
        const oldIdCardPath = path.join(process.cwd(), 'public', existingKyc.idCard);
        try {
          await unlink(oldIdCardPath);
        } catch (error) {
          console.warn('Could not delete old ID card file:', error);
        }
      }
      
      // Process new ID card
      await mkdir(uploadDir, { recursive: true });
      const idCardBuffer = Buffer.from(await idCard.arrayBuffer());
      const idCardSanitized = idCard.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const idCardFilename = `idcard_${Date.now()}_${idCardSanitized}`;
      const idCardPath = path.join(uploadDir, idCardFilename);
      await writeFile(idCardPath, idCardBuffer);
      existingKyc.idCard = `/uploads/${idCardFilename}`;
    }

    if (passport && passport.size > 0) {
      // Remove old passport file if it exists
      if (existingKyc.passport) {
        const oldPassportPath = path.join(process.cwd(), 'public', existingKyc.passport);
        try {
          await unlink(oldPassportPath);
        } catch (error) {
          console.warn('Could not delete old passport file:', error);
        }
      }
      
      // Process new passport
      await mkdir(uploadDir, { recursive: true });
      const passportBuffer = Buffer.from(await passport.arrayBuffer());
      const passportSanitized = passport.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const passportFilename = `passport_${Date.now()}_${passportSanitized}`;
      const passportPath = path.join(uploadDir, passportFilename);
      await writeFile(passportPath, passportBuffer);
      existingKyc.passport = `/uploads/${passportFilename}`;
    }

    // Save updated KYC record
    await existingKyc.save();

    return NextResponse.json(
      { message: "KYC Reapplication Submitted" }, 
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      console.error('KYC reapplication error:', error);

      // Type assertion for MongoDB validation error
      const mongoError = error as any;
      
      if (mongoError.errors && typeof mongoError.errors === 'object') {
        const validationErrors = Object.values(mongoError.errors).map((e: any) => ({
          field: e.path,
          message: e.message,
          value: e.value
        }));
        
        console.error('MongoDB Validation errors:', validationErrors);
        
        return NextResponse.json(
          { 
            error: "Validation Failed", 
            details: validationErrors 
          }, 
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}