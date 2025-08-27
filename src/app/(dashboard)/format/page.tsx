import Link from 'next/link'
import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { GiPiggyBank } from "react-icons/gi";   
import { BsBank } from "react-icons/bs";
import { FiUser } from "react-icons/fi";

import { LuBrain } from "react-icons/lu";


const page = () => {
  return (
    <div className='dashboard'>
        <div className="transfer_p">
            <div className="transfer_p-top">
                <Link className='flex items-center gap-2' href={'/dashboard'}>
                    <FaArrowLeftLong />
                    <p>Back to Dashboard</p>
                </Link>
                <h1>Billing Format</h1>
            </div>
            <div className="transfer_p-container">
                <div className='flex items-center gap-1.5'> 
                    <LuBrain className='text-3xl' /> 
                    <h1>Logistics</h1>
                </div>
                <div className="transfer_p-content">
                    <div className="recipient">
                        <span className='flex items-center gap-1.5'>
                            <FiUser /> 
                            <h2>First Format</h2>
                        </span>
                        <div className="receipt">
                            <div className="receipt-content">
                                <h3>Title *</h3>
                                <input type="text" placeholder='Format title...' />
                            </div>
                        </div>
                        <div className="receipt">
                            <div className="receipt-content">
                                <h3>Description *</h3>
                                <textarea name=""  placeholder='Format Description...'  id=""></textarea>
                            </div>
                        </div>
                    </div>
                    <button>
                        Update Format
                    </button>
                </div>
                <div className="transfer_p-content transfer_p-content2 ">
                    <div className="recipient">
                        <span className='flex items-center gap-1.5'>
                            <FiUser /> 
                            <h2>Second Format</h2>
                        </span>
                        <div className="receipt">
                            <div className="receipt-content">
                                <h3>Title *</h3>
                                <input type="text" placeholder='Format title...' />
                            </div>
                        </div>
                        <div className="receipt">
                            <div className="receipt-content">
                                <h3>Description *</h3>
                                <textarea name=""  placeholder='Format Description...'  id=""></textarea>
                            </div>
                        </div>
                    </div>
                    <button>
                        Update Format
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page