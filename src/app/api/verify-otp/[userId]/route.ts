import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

export async function POST(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    console.log('API Route called with params:', context.params);
    
    const { userId } = context.params;
    console.log('Extracted userId:', userId);
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { otp } = body;
    
    if (!userId) {
      console.log('User ID missing');
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!otp) {
      console.log('OTP missing');
      return NextResponse.json(
        { success: false, error: "OTP is required" },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectMongoDB();
    console.log('Connected to MongoDB');

    // Find the withdrawal record
    console.log('Searching for withdrawal with clerkId:', userId);
    const withdrawal = await Withdrawal.findOne({ clerkId: userId });
    console.log('Found withdrawal:', withdrawal);
    
    if (!withdrawal) {
      console.log('Withdrawal record not found');
      return NextResponse.json(
        { success: false, error: "Withdrawal record not found" },
        { status: 404 }
      );
    }

    // Check if the withdrawal record has an OTP field
    if (!withdrawal.otp) {
      console.log('No OTP field in withdrawal record');
      return NextResponse.json(
        { success: false, error: "No OTP found for this withdrawal" },
        { status: 400 }
      );
    }

    console.log('Stored OTP:', withdrawal.otp);
    console.log('Entered OTP:', otp);

    // Check if entered OTP matches the OTP in database
    if (otp === withdrawal.otp) {
      console.log('OTP matched, updating approval status to 3');
      
      // Update withdrawal status to 3 (approved/verified)
      withdrawal.approve = '3';
      await withdrawal.save();
      
      console.log('Withdrawal updated successfully');
      
      return NextResponse.json({ 
        success: true, 
        message: "OTP verified successfully" 
      });
    } else {
      console.log('OTP mismatch');
      return NextResponse.json(
        { success: false, error: "Invalid OTP" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}