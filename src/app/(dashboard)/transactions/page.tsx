import React from 'react'
import { LuDownload } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { IoMdSwap } from "react-icons/io";
import { FaBtc } from "react-icons/fa";
import Image from 'next/image';

const page = () => {
  return (
    <div className='dashboard transactions'>
        <div className="transactions-top">
            <h1>Transactions</h1>
            <button><LuDownload /> <p>Export</p></button>
        </div>
        <div className="transactions-container">
            <div className="transactions-content">
                <div className="transactions-content-top">
                    <h2>Transaction History</h2>
                    <p>View and search your recent transactions.</p>
                    <div className="transactions-search">
                        <div className="trans-wrapp">
                            <FiSearch className='text-black' />
                            <input placeholder='Search transactions' type="text" />
                        </div>
                        <button>Search</button>
                    </div>
                    <div className="transaction-box">
                        <Image src={'/trans.webp'} height={150} width={150} alt='kjh' />
                        <h3>No transaction completed yet</h3>
                        <p>Your transaction history will appear here once you start making transfers and payments.</p>
                        <div className="transfers-wrap">
                            <div className="transfer-money">
                                <button>
                                    <FaBtc className='jhgfcvbn' /> 
                                    <h2>Make Deposit</h2>
                                </button>
                            </div>
                            <div className="transfer-money">
                                <button className='kjkjhn'>
                                    <IoMdSwap className='jhgfcvbn' />
                                    <h2>Make Transfer</h2>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page