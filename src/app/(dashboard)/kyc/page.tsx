"use client"
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { FiUser } from "react-icons/fi";
import Image from 'next/image';
import OnboradingSuccess from '@/component/Success';
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface KycData {
  clerkId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  account: string;
  approve: string;
  balance: string;
  country: string;
  state: string;
  idCardFileName: File | null;
  passportFileName: File | null;
}

const Page = () => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoaded } = useUser();
  const userId = user?.id || null;

  // Generate a random 10-digit account number
  const min = 1000000000;
  const max = 9999999999;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  
  const [kyc, setKyc] = useState<KycData>({
    clerkId: userId,
    firstName: '',
    lastName: '',
    email: '',
    account: randomNum.toString(),
    approve: '0',
    balance: '0',
    country: '',
    state: '',
    idCardFileName: null,
    passportFileName: null,
  });

  // Update form when user data is loaded
  useEffect(() => {
    if (isLoaded && user) {
      setKyc(prev => ({
        ...prev,
        clerkId: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
      }));
    }
  }, [user, isLoaded]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKyc(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setKyc(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const createUser = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required files
    if (!kyc.idCardFileName || !kyc.passportFileName) {
      alert('Please upload both ID card and passport');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('clerkId', kyc.clerkId || '');
      formData.append('firstName', kyc.firstName);
      formData.append('lastName', kyc.lastName);
      formData.append('email', kyc.email);
      formData.append('account', kyc.account);
      formData.append('approve', kyc.approve);
      formData.append('balance', kyc.balance);
      formData.append('country', kyc.country);
      formData.append('state', kyc.state);
      formData.append('idCardFileName', kyc.idCardFileName);
      formData.append('passportFileName', kyc.passportFileName);

      const response = await fetch('/api/kyc', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/success');
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to submit KYC'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting the form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetStarted = () => router.push('/dashboard');

  if (isSuccess) {
    return <OnboradingSuccess handleGetStarted={handleGetStarted} />;
  }

  return (
    <div className='dashboard'>
      <div className="kyc">
        <div className="kyc-container">
          <div className="kyc-left">
            <Image src={'/kyc.jpg'} alt='KYC Verification' className='kyc-img' height={70} width={70} />
            <div className="kyc-content">
              <h1>Complete Your KYC to Get Started 🚀</h1>
              <p>Get your account number and start using your account.</p>
            </div>
          </div>
          <Image src={'/de.webp'} alt='Decoration' className='kyc-bot' height={100} width={100} />
        </div>
      </div>
      <div className="transfer_p">
        <form onSubmit={createUser} className="transfer_p-container">
          <div className="transfer_p-content">
            <div className="recipient">
              <span className='flex items-center gap-1.5'>
                <FiUser /> 
                <h2>KYC Form</h2>
              </span>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>First Name *</h3>
                  <input 
                    type="text" 
                    name="firstName"
                    onChange={handleInputChange} 
                    value={kyc.firstName} 
                    placeholder='John' 
                    required 
                  />
                </div>
                <div className="receipt-content">
                  <h3>Last Name *</h3>
                  <input 
                    type="text" 
                    name="lastName"
                    onChange={handleInputChange} 
                    value={kyc.lastName} 
                    placeholder='Doe' 
                    required 
                  />
                </div>
              </div>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Country *</h3>
                  <input 
                    type="text" 
                    name="country"
                    onChange={handleInputChange} 
                    value={kyc.country} 
                    placeholder='Enter Country...' 
                    required 
                  />
                </div>
                <div className="receipt-content">
                  <h3>State *</h3>
                  <input 
                    type="text" 
                    name="state"
                    onChange={handleInputChange} 
                    value={kyc.state} 
                    placeholder='Enter State...' 
                    required 
                  />
                </div>
              </div>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Email *</h3>
                  <input 
                    type="email" 
                    name="email"
                    onChange={handleInputChange} 
                    value={kyc.email} 
                    placeholder='Enter Email...' 
                    required 
                  />
                </div>
              </div>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>ID Card *</h3>
                  <input 
                    type="file" 
                    name="idCardFileName"
                    onChange={handleFileChange} 
                    accept="image/*,.pdf"
                    required 
                  />
                </div>
                <div className="receipt-content">
                  <h3>Passport *</h3>
                  <input 
                    type="file" 
                    name="passportFileName"
                    onChange={handleFileChange} 
                    accept="image/*,.pdf"
                    required 
                  />
                </div>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;