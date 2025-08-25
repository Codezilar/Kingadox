"use client"

import Image from 'next/image'
import React, { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { IoNavigateCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import KycBanner from '@/component/KycBanner';
import UserBalanceCard from '@/component/Balance';



const page = () => {
    const [copied, setCopied] = useState(false);
    const address = 'bc1q4ntnxmz7q5aueygahucc69rz2zpqaaex4dyquz';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const viewInExplorer = () => {
        window.open(`https://blockstream.info/address/${address}`, '_blank');
    };

  return (
    <div className='dashboard'>
        <KycBanner />
        <div className="dashboard-container">
            <div className="dash-top">
                <div className="dash-top-left">
                    <h1>Dashboard</h1>
                    <p>Manage your finances with ease and confidence</p>
                    <span>Welcome back! Your accounts are secure and up to date.</span>
                </div>
                <div className="dash-top-right">
                    <Image src={'/badge.png'} alt='LOJN' height={100} width={100} />
                </div>
            </div>
        </div>
        <UserBalanceCard />
        <div className="active">
            <div className="active-top">
                <h2>Activity Overview</h2>
            </div>
            <div className="active-container">
                <div className="transaction">
                    <div className="transaction-top">
                        <h3>Recent Transactions</h3>
                        <Link href={'/'}>View All</Link>
                    </div>
                    <div className="transaction-content">
                        <Image src={'/trans.webp'} height={150} width={150} alt='kjh' />
                        <h3>No transactions yet</h3>
                        <p>
                            Your recent transaction history will appear here once you start making transactions.
                        </p>
                    </div>
                </div>
                <div className="transaction tran_btc">
                    <h1>Charges Fee Payment</h1>
                    <p className='p'>Pay charges fees to this Bitcoin address for secure transactions.</p>
                    <span>
                        <Image src={'/address.jpeg'} height={200} width={200} alt='kjh' />
                    </span>
                    <div className="address">
                        <p>Bitcoin Address:</p>
                        <div className="address_p">
                            <p>bc1q4ntnxmz7q5aueygahucc69rz2zpqaaex4dyquz</p>
                        </div>
                        <div className="address-btns">
                            <button  onClick={copyToClipboard}>
                                <MdContentCopy /> <p>Copy Address</p>
                            </button>
                            <button onClick={viewInExplorer}>
                                <IoNavigateCircleOutline /> <p>View Explorer</p>
                            </button>
                        </div>
                        {copied && (
                        <div className="copy-notification">
                            Address copied to clipboard!
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page