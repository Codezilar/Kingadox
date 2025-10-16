import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

// Generate a random 4-digit OTP
function generateOTP(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const clerkId = formData.get('clerkId') as string;
    const amount = formData.get('amount') as string;
    const transferType = formData.get('transferType') as string;
    const recipientName = formData.get('recipientName') as string;
    const bankName = formData.get('bankName') as string;
    const aza = formData.get('aza') as string;
    const routingNumber = formData.get('routingNumber') as string;
    
    // Validate required fields
    if (!clerkId || !amount || !transferType || !recipientName || !bankName || !aza || !routingNumber) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    await connectMongoDB();
    const existingWithdrawal = await Withdrawal.findOne({ clerkId });

    // Generate OTP
    const otp = generateOTP();

    // Update or create withdrawal record
    const withdrawalData = {
      clerkId,
      amount,
      transferType,
      recipientName,
      bankName,
      aza,
      routingNumber,
      approve: "0",
      otp // Add OTP field
    };

    let result;
    if (existingWithdrawal) {
      result = await Withdrawal.findOneAndUpdate(
        { clerkId },
        withdrawalData,
        { new: true, runValidators: true }
      );
    } else {
      result = await Withdrawal.create(withdrawalData);
    }

    return NextResponse.json(
      { 
        message: existingWithdrawal ? "Withdrawal Updated Successfully" : "Withdrawal Request Submitted",
        accountNumber: aza,
        isReapplication: !!existingWithdrawal,
        approve: "0",
        otp // Return OTP in response
      }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Withdrawal submission error:', error);
    
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
        { error: "Withdrawal application already exists for this user" }, 
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
    await connectMongoDB();
    
    const withdrawalData = await Withdrawal.find({}).sort({ createdAt: -1 }).lean();
    
    const serializedData = withdrawalData.map(doc => ({
      clerkId: doc.clerkId,
      amount: doc.amount,
      transferType: doc.transferType,
      recipientName: doc.recipientName,
      bankName: doc.bankName,
      aza: doc.aza,
      routingNumber: doc.routingNumber,
      approve: doc.approve || '0',
      otp: doc.otp, // Include OTP in GET response
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString() || new Date().toISOString()
    }));
    
    return NextResponse.json({ withdrawals: serializedData }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching withdrawal data:', error);
    return NextResponse.json(
      { error: 'Complete KYC!' },
      { status: 500 }
    );
  }
}
export async function PUT(request: NextRequest) {
  try {
    // Read from request body instead of query parameters
    const { clerkId, action } = await request.json();

    if (!clerkId || !action) {
      return NextResponse.json(
        { error: "Missing clerkId or action parameter" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const updateData = {
      approve: action === 'approve' ? '1' : '2',
      updatedAt: new Date()
    };

    const updatedWithdrawal = await Withdrawal.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedWithdrawal) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        withdrawal: updatedWithdrawal
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Withdrawal update error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}