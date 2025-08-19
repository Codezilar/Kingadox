import Image from 'next/image'
import { MdContentCopy } from "react-icons/md";
import { IoNavigateCircleOutline } from "react-icons/io5";
import React from 'react'

const page = () => {
  return (
    <div className='bitcoin'>
        <div className="deposit-top">
            <h1>Bitcoin Deposits</h1>
            <p>Deposit Bitcoin to your account using the address below</p>
        </div>
        {/* <span>
            <h3>Deposit Address</h3>
            <p>Send Bitcoin to this address</p>
        </span> */}
        <Image src={'/address.jpeg'} height={200} width={200} alt='kjh' />
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
  )
}

export default page