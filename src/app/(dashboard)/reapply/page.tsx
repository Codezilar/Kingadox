// app/reapply/page.tsx
'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FiUser, FiArrowLeft } from "react-icons/fi";
import Image from 'next/image';
import OnboradingSuccess from '@/component/Success';
import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const ReapplyPage = () => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingKyc, setExistingKyc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { userId, sessionId } = useAuth();
  const { user } = useUser();

  const [kyc, setKyc] = useState({
    clerkId: userId,
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    state: '',
    idCard: null as File | null,
    passport: null as File | null,
  });

  // Fetch existing KYC data
  useEffect(() => {
    const fetchExistingKyc = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/kyc/admin/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setExistingKyc(data.kyc);
          setKyc(prev => ({
            ...prev,
            firstName: data.kyc.firstName || '',
            lastName: data.kyc.lastName || '',
            email: data.kyc.email || '',
            country: data.kyc.country || '',
            state: data.kyc.state || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching KYC data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingKyc();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('clerkId', kyc.clerkId || '');
      formData.append('firstName', kyc.firstName);
      formData.append('lastName', kyc.lastName);
      formData.append('email', kyc.email);
      formData.append('country', kyc.country);
      formData.append('state', kyc.state);
      if (kyc.idCard) formData.append('idCard', kyc.idCard);
      if (kyc.passport) formData.append('passport', kyc.passport);

      const response = await fetch('/api/kyc/reapply', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Reapplication failed:', errorData);
        alert(`Reapplication failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting reapplication:', error);
      alert('Error submitting reapplication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'idCard' | 'passport') => {
    if (e.target.files && e.target.files[0]) {
      setKyc({ ...kyc, [field]: e.target.files[0] });
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading your KYC information...</div>
      </div>
    );
  }

  if (isSuccess) {
    return <OnboradingSuccess />;
  }

  return (
    <div className='dashboard'>
      <div className="kyc">
        <div className="kyc-container">
          <div className="kyc-left">
            <Image src={'/kyc.jpg'} alt='KYC' className='kyc-img' height={70} width={70} />
            <div className="kyc-content">
              <h1>Update Your KYC Information 🔄</h1>
              <p>Please review and update your information as needed.</p>
            </div>
          </div>
          <Image src={'/de.webp'} alt='Decoration' className='kyc-bot' height={100} width={100} />
        </div>
      </div>

      <div className="transfer_p">
        <div className="back-button">
          <Link href="/dashboard">
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="transfer_p-container">
          <div className="transfer_p-content">
            <div className="recipient">
              <span className='flex items-center gap-1.5'>
                <FiUser /> 
                <h2>KYC Update Form</h2>
              </span>
              
              <div className="receipt">
                <div className="receipt-content">
                  <h3>First Name *</h3>
                  <input 
                    type="text" 
                    onChange={(e) => setKyc({...kyc, firstName: e.target.value})} 
                    value={kyc.firstName} 
                    placeholder='John' 
                    required 
                  />
                </div>
                <div className="receipt-content">
                  <h3>Last Name *</h3>
                  <input 
                    type="text" 
                    onChange={(e) => setKyc({...kyc, lastName: e.target.value})} 
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
                    onChange={(e) => setKyc({...kyc, country: e.target.value})} 
                    value={kyc.country}
                    placeholder='Enter Country...' 
                    required 
                  />
                </div>
                <div className="receipt-content">
                  <h3>State *</h3>
                  <input 
                    type="text" 
                    onChange={(e) => setKyc({...kyc, state: e.target.value})} 
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
                    onChange={(e) => setKyc({...kyc, email: e.target.value})} 
                    value={kyc.email}
                    placeholder='your.email@example.com' 
                    required 
                  />
                </div>
              </div>
              
              <div className="receipt">
                <div className="receipt-content">
                  <h3>ID Card {existingKyc?.idCard ? '(Update if needed)' : '*'}</h3>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileChange(e, 'idCard')}
                    accept="image/*,.pdf"
                  />
                </div>
                <div className="receipt-content">
                  <h3>Passport {existingKyc?.passport ? '(Update if needed)' : '*'}</h3>
                  <input 
                    type="file" 
                    onChange={(e) => handleFileChange(e, 'passport')}
                    accept="image/*,.pdf"
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update KYC Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReapplyPage