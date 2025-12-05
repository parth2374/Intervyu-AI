"use client"

import React, { useEffect } from 'react';
import { CheckCircleIcon, Send } from 'lucide-react';
import { useAuthContext } from '@/app/provider';
import { useRouter } from 'next/navigation';

const InterviewCompleted = () => {

  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user])

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      {/* Top Section */}
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden mt-8">
        <div className="flex justify-center mt-6">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-center mt-4">Interview Complete!</h2>
        <p className="text-center text-gray-500 mt-2">
          Thank you for participating in the AI-driven interview with AIcruiter
        </p>
        <img
          src={'/InterviewCompleted.jpg'}
          alt="Interview illustration"
          className="w-full object-cover mt-4 max-h-96 rounded-2xl"
        />
      </div>

      {/* Next Steps Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 mt-8 mb-8">
        <div className="flex justify-center mb-4">
          <div className='bg-blue-500 rounded-full flex items-center justify-center'>
						<Send className="h-12 w-12 p-3 text-white" />
					</div>
        </div>
        <h3 className="text-2xl font-semibold text-center">What's Next?</h3>
        <p className="text-center text-gray-500 mt-2">
          The recruiter will review your interview responses and will contact you soon regarding the next steps.
        </p>
        <p className="text-center text-gray-400 mt-2">
          ⏰ Response within 2-3 business days
        </p>
      </div>

      {/* Footer */}
      <footer className="text-gray-400 text-sm mb-4">
        © 2025 Intervyu AI. All rights reserved.
      </footer>
    </div>
  );
};

export default InterviewCompleted;