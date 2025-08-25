import OnboardingSuccess from '@/component/Success'
import React from 'react'

const Page = () => {
  // Define the handler function
  const handleGetStarted = () => {
    // This could contain analytics tracking or other logic
    console.log("User is proceeding to dashboard");
  };

  return (
    <OnboardingSuccess handleGetStarted={handleGetStarted} />
  )
}

export default Page