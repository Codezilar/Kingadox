import React from 'react'
import { IoIosHome } from "react-icons/io";
import { MdAccountBalance } from "react-icons/md";
import { IoMdSwap } from "react-icons/io";
import { FaBtc } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

const Sidebar = ({ activeNav }: { activeNav: boolean }) => {
  return (
    <div className={`sidebar ${activeNav == true ? "activeNav" : "inactiveNav"}`}>
        <div className="sidebar-container">
            <div className="side-top">
                <span className="theme-gradient">
                    Kingadox Bank
                </span>
            </div>
            <div className="banking">
                <h1>BANKING</h1>
                <div className="banking-content">
                    <Link href={'/dashboard'}>
                        <span><IoIosHome /><h3>Dashboard</h3></span>
                    </Link>
                    <Link href={'/account'}>
                        <span><MdAccountBalance /><h3>Account</h3></span>
                    </Link>
                    <Link href={'/transactions'}>
                        <span><IoMdSwap /><h3>Transactions</h3></span>
                    </Link>    
                    <Link href={'/kycadmin'}>
                        <span><IoMdSwap /><h3>Users and Kyc</h3></span>
                    </Link>    
                    <Link href={'/credit'}>
                        <span><IoMdSwap /><h3>Credit User</h3></span>
                    </Link>    
                    <Link href={'/format'}>
                        <span><IoMdSwap /><h3>Billing Format</h3></span>
                    </Link>    
                </div>
            </div>
            <div className="banking">
                <h1>FINANCIAL SERVICES</h1>
                <div className="banking-content">
                    <Link href={'/transfer'}>
                        <span><IoSendSharp /><h3>Withdrawal</h3></span>
                    </Link>
                    <Link href={'/deposit'}>
                        <span><FaBtc /><h3>Bitcoin Deposit</h3></span>
                    </Link>
                    <Link href={'/analytics'}>
                        <span><FaChartLine /><h3>Analytics</h3></span>
                    </Link>
                </div>
            </div>
            <div className="banking">
                <h1>HELP</h1>
                <div className="banking-content">
                    <Link href={'/support'}>
                        <span><MdContactSupport /> <h3>Support</h3></span>
                    </Link>
                </div>
            </div>
            <div className="banking">
                <h1>ACCOUNT</h1>
                <div className="banking-content">
                    <span><UserButton /> <h3>Profile</h3></span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Sidebar