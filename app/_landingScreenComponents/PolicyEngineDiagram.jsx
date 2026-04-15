import React from 'react';
import { ChevronRight } from 'lucide-react';
import './LandingPageStyles.css'

export default function PolicyEngineDiagram() {
  return (
    <div className="min-h-screen mt-12 bg-[#f7f7f5] px-20 py-20 font-[LandingFont] w-full overflow-hidden">
      <div className="max-w-[67rem] mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl tracking-tighter mb-6 text-black">
              The infrastructure<br />behind every decision
            </h1>
            <p className="text-xl text-gray-500 tracking-tight">
              At the heart of Duna's platform is a powerful policy and risk<br />
              engine driving decisions across the full customer lifecycle.
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-full hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
            <span className="font-medium">Explore</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Diagram Section */}
        <div className="relative flex items-center justify-center min-h-[600px] lg:scale-100 md:scale-90 scale-70">
          {/* Decide - Top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div className="bg-[#e8e8e7] px-12 py-4 rounded-full">
              <span className="text-xl text-gray-900">Decide</span>
            </div>
            {/* Connecting line down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gray-300"></div>
          </div>

          {/* Onboard - Left */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <div className="bg-[#e8e8e7] px-12 py-4 rounded-full">
              <span className="text-xl text-gray-900">Onboard</span>
            </div>
            {/* Connecting line right */}
            <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-[4.5rem] h-0.5 bg-gray-300"></div>
          </div>

          {/* Lifecycle - Right */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="bg-[#e8e8e7] px-12 py-4 rounded-full">
              <span className="text-xl text-gray-900">Lifecycle</span>
            </div>
            {/* Connecting line left */}
            <div className="absolute top-1/2 right-full transform -translate-y-1/2 w-[4.5rem] h-0.5 bg-gray-300"></div>
          </div>

          {/* Data Platform - Bottom */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            {/* Connecting line up */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gray-300"></div>
            <div className="bg-[#e8e8e7] px-10 py-4 rounded-full">
              <span className="text-xl text-gray-900">Data Platform</span>
            </div>
          </div>

          {/* Center - Policy Engine with multiple rings */}
          <div className="relative flex items-center w-full justify-center">
            {/* Outer rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[525px] h-[235px] rounded-full border-3 border-gray-200"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[540px] h-[250px] rounded-full border-3 border-gray-200"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[555px] h-[265px] rounded-full border-2 border-gray-200"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[570px] h-[280px] rounded-full border-1 border-gray-200"></div>
            </div>

            {/* Main center capsule with mountain background */}
            <div className="relative w-[510px] h-[220px] rounded-full overflow-hidden border-4 border-gray-300 backdrop-blur-md bg-white/10">
              {/* Mountain gradient background */}
              <div className="absolute inset-0 bg-[url('/PolicyEngineImage.avif')] bg-cover bg-center">
              </div>

              {/* Text overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-5xl font-bold text-white drop-shadow-lg">
                  Policy Engine
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}