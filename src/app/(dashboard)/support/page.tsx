import React from 'react'
import { FaRegUser } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";


const page = () => {
  return (
    <div className='dashboard support-form'>
      <div className="support">
        <div className="support-container">
          <div className="support-top">
            <h1>Submit a Support Ticket</h1>
            <p>Fill out the form below to create a support ticket.</p>
          </div>
          <form action="">
              <div className="suppot-info">
                <div className="support-cred">
                  <div className="suport-data">
                    <h2>Full Name</h2>
                    <span>
                      <FaRegUser />
                      <input type="text" placeholder='John Doe' name="" id="" />
                    </span>
                  </div>
                  <div className="suport-data">
                    <h2>Full Name</h2>
                    <span>
                      <FaEnvelope />
                      <input type="email" placeholder='john@example.com' name="" id="" />
                    </span>
                  </div>
                </div>
                <div className="suport-data">
                  <h2>Issue Category</h2>
                  <span>
                    <select name="" id="">
                      <option value="">Account Issues</option>
                      <option value="">Transfer Problem</option>
                      <option value="">Card Services</option>
                      <option value="">Login Troubles</option>
                      <option value="">Other</option>
                    </select>  
                  </span>
                </div>
                <div className="suport-data">
                  <h2>Subject</h2>
                  <span>
                    <input type="text" placeholder='Brief description of your issue...' name="" id="" />
                  </span>
                </div>
                <div className="suport-data">
                  <h2>Message</h2>
                  <textarea name="" placeholder='Please provide ddetails about your issues...' id=""></textarea>
                </div>
                <button>Submit Ticket</button>
              </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page