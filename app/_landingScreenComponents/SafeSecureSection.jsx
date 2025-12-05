import React from 'react';
import { ChevronRight, Shield, Lock, CheckCircle } from 'lucide-react';
import './LandingPageStyles.css'

export default function SafeSecureSection() {
  return (
    <div className="min-h-[65vh] bg-[#f7f7f5] flex items-center font-[LandingFont] justify-center mt-14 px-6 py-20">
      <div className="max-w-[67rem] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h2 className="text-5xl text-gray-900 tracking-tighter">
              Safe and secure
            </h2>
            
            <p className="text-xl text-gray-500 tracking-tight w-full">
              Your trust is our foundation. Duna is designed with a deep commitment to data 
              privacy and security. Visit our trust page and security center to learn more.
            </p>
            
            <button className="group flex items-center gap-2 px-8 py-4 border-2 border-gray-300 rounded-full hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
              <span className="text-lg font-medium">Explore</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Content - Certification Badges */}
          <div className="flex items-center justify-center gap-8 lg:justify-end">
            {/* AICPA SOC2 Badge */}
            <div className="group relative">
              <div className="w-28 h-28 rounded-full border-2 border-gray-200 flex items-center justify-center hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-1 text-gray-700" />
                  <div className="text-sm font-bold text-gray-900">AICPA</div>
                  <div className="text-sm font-bold text-gray-900">SOC2</div>
                </div>
              </div>
            </div>

            {/* GDPR Badge */}
            <div className="group relative">
              <div className="w-28 h-28 rounded-full border-2 border-gray-200 flex items-center justify-center hover:scale-105 transition-all duration-300 relative">
                {/* Stars around the circle */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x = 50 + 45 * Math.cos(angle - Math.PI / 2);
                    const y = 50 + 45 * Math.sin(angle - Math.PI / 2);
                    return (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-gray-400 rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    );
                  })}
                </div>
                <div className="text-center z-10">
                  <Lock className="w-8 h-8 mx-auto mb-1 text-gray-700" />
                  <div className="text-lg font-bold text-gray-900">GDPR</div>
                </div>
              </div>
            </div>

            {/* ISO 27001 Badge */}
            <div className="group relative">
              <div className="w-28 h-28 rounded-full border-2 border-gray-200 flex items-center justify-center hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-1 text-gray-700" />
                  <div className="text-lg font-bold text-gray-900">ISO</div>
                  <div className="text-sm font-bold text-gray-900">27001</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}