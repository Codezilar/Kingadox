import Link from 'next/link'
import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { GiPiggyBank } from "react-icons/gi";   
import { BsBank } from "react-icons/bs";
import { FiUser } from "react-icons/fi";


const page = () => {
  return (
    <div className='dashboard'>
        <div className="transfer_p">
            <div className="transfer_p-top">
                <Link className='flex items-center gap-2' href={'/dashboard'}>
                    <FaArrowLeftLong />
                    <p>Back to Dashboard</p>
                </Link>
                <h1>Transfer Funds</h1>
            </div>
            <div className="transfer-nav">
                <button>
                    <BsBank />
                    <p>To Bank</p>
                </button>
            </div>
            <div className="transfer_p-container">
                <div className='flex items-center gap-1.5'> 
                    <GiPiggyBank className='text-3xl' /> 
                    <h1>External Bank Transfer</h1>
                </div>
                <div className="transfer_p-content">
                    <div className="tf">
                        <div className="tf-content">
                            <h3>From Account</h3>
                            <select name="" id="">
                                <option value="">Account</option>
                            </select>
                        </div>
                        <div className="tf-content">
                            <h3>Transfer Type</h3>
                            <select name="" id="">
                                <option value="">ACH Transfer (1-3 businessdays)</option>
                                <option value="">Wire Transfer (Same day)</option>
                                <option value="">Zelle (Instant)</option>
                            </select>
                        </div>
                    </div>
                    <div className="recipient">
                        <span className='flex items-center gap-1.5'>
                            <FiUser /> 
                            <h2>Recipient Information</h2>
                        </span>
                        <div className="receipt">
                            <div className="receipt-content">
                                <h3>Recipient Name *</h3>
                                <input type="text" placeholder='Full name as it appears on account' />
                            </div>
                            <div className="receipt-content">
                                <h3>Bank Name *</h3>
                                <input type="text" placeholder='e.g., Chase Bank, Bank of America' />
                            </div>
                        </div>
                        <div className="receipt">
                            <div className="receipt-content">
                                <h3>Account Number *</h3>
                                <input type="text" placeholder='Recipient account number' />
                            </div>
                            <div className="receipt-content">
                                <h3>Routing Number *</h3>
                                <input type="text" placeholder='9-digit routing number' />
                            </div>
                        </div>
                    </div>
                    <div className="tf-amount">
                        <h3>Transfer Amount ($USD)</h3>
                        <input type="number" placeholder='Enter amount to transfer' />
                    </div>
                    <button>
                        Send Transfer
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page