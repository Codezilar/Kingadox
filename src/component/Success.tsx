"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const OnboardingSuccess = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    // This could contain analytics tracking or other logic
    console.log("User is proceeding to dashboard");
    // You can add any additional logic here
  };

  const handleClick = () => {
    handleGetStarted();
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-br from-slate-900 to-blue-950 relative overflow-hidden">
      {/* Blue glow effect across UI */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-soft-light filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-slate-700 rounded-full mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-6 relative z-10"
      >
        <CheckCircle className="h-16 w-16 text-blue-400" strokeWidth={1.5} />
      </motion.div>
      
      <h2 className="text-2xl font-semibold mb-4 text-blue-300 relative z-10">
        Onboarding Complete!
      </h2>
      
      <p className="text-blue-100 mb-8 max-w-md relative z-10">
        Your consistency profile is ready. Let&apos;s build your personalized plan.
      </p>
      
      <button 
        onClick={handleClick}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
      >
        Continue to Dashboard
      </button>
    </div>
  );
};

export default OnboardingSuccess;