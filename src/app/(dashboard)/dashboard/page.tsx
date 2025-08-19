
import Image from 'next/image'
import React from 'react'
import { IoIosTrendingUp } from "react-icons/io";
import { CiWallet } from "react-icons/ci";
import { HiOutlineWallet } from "react-icons/hi2";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdWaterfallChart } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { IoNavigateCircleOutline } from "react-icons/io5";
import Link from 'next/link';

const page = () => {
  return (
    <div className='dashboard'>
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
        <div className="card">
                <div className="card-container card-green">
                    <div className="card-top">
                        <div className="card-bal">
                            <span>
                                <CiWallet className='text-3xl' />
                            </span>
                            <p><IoIosTrendingUp /> 2.3%</p>
                        </div>
                        <h1>$8,967</h1>
                        <p>All accounts combined</p>
                    </div>
                </div>
                <div className="card-container ololol">
                    <div className="card-top">
                        <div className="card-bals">
                            <span>
                                <HiOutlineWallet />
                            </span>
                            <p>Checking Balance</p>
                        </div>
                        <h1>$967</h1>
                        <p>Primary Checking</p>
                    </div>
                </div>
                <div className="card-container ololol">
                    <div className="card-top">
                        <div className="card-bals">
                            <span>
                                <FaArrowTrendUp />
                            </span>
                            <p>Investment Balance</p>
                        </div>
                        <h1>$20,967</h1>
                        <p>Investment Account</p>
                    </div>
                </div>
                <div className="card-container ololol">
                    <div className="card-top">
                        <div className="card-bals">
                            <span>
                                <MdWaterfallChart />
                            </span>
                            <p>Recent Activity</p>
                        </div>
                        <h1>$8000</h1>
                        <p>Last 7 days</p>
                    </div>
                </div>
        </div>
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
                            <button>
                                <MdContentCopy /> <p>Copy Address</p>
                            </button>
                            <button>
                                <IoNavigateCircleOutline /> <p>View Explorer</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default page