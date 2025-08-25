"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const OnboardingSuccess = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = useCallback(async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    try {
      // Analytics or other logic
      console.log("User is proceeding to dashboard");
      router.push('/dashboard');
    } catch (error) {
      console.error("Navigation failed:", error);
      setIsNavigating(false);
    }
  }, [router, isNavigating]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-br from-slate-900 to-blue-950 relative overflow-hidden">
      {/* Blue glow effect */}
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
        disabled={isNavigating}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
      >
        {isNavigating ? "Loading..." : "Continue to Dashboard"}
      </button>
    </div>
  );
};

export default OnboardingSuccess;