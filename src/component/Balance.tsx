'use client';

import { useState, useEffect } from 'react';
import { CiWallet } from "react-icons/ci";
import { IoIosTrendingUp } from "react-icons/io";
import { HiOutlineWallet } from "react-icons/hi2";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdWaterfallChart } from "react-icons/md";

interface UserBalance {
  balance: string;
  firstName: string;
  lastName: string;
}

const UserBalanceCard = () => {
  const [balanceData, setBalanceData] = useState<UserBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/balance');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user balance');
      }
      
      const data = await response.json();
      setBalanceData(data);
    } catch (err) {
      setError('Error loading balance data');
      console.error('Balance fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-container card-green">
        <div className="card-top">
          <div className="card-bal">
            <span>
              <CiWallet className='text-3xl' />
            </span>
            <p><IoIosTrendingUp /> 2.3%</p>
          </div>
          <h1>Loading...</h1>
          <p>All accounts combined</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-container card-green">
        <div className="card-top">
          <div className="card-bal">
            <span>
              <CiWallet className='text-3xl' />
            </span>
            <p><IoIosTrendingUp /> 2.3%</p>
          </div>
          <h1>$0.00</h1>
          <p>Error loading balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
                <div className="card-container card-green">
                  <div className="card-top">
                    <div className="card-bal">
                      <span>
                        <CiWallet className='text-3xl' />
                      </span>
                      <p><IoIosTrendingUp /> 2.3%</p>
                    </div>
                    <h1>${parseFloat(balanceData?.balance || '0').toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</h1>
                    <p>{balanceData?.firstName}'s account balance</p>
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
                        <h1>$0.00</h1>
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
                        <h1>$0.00</h1>
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
                        <h1>${parseFloat(balanceData?.balance || '0').toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}</h1>
                        <p>Last 7 days</p>
                    </div>
                </div>
                
    </div>
  );
};

export default UserBalanceCard;