'use client'

import React, { useState } from 'react';
import { ChevronRight, Zap, Info, Globe, CreditCard, Home, Wallet, ShieldCheck, Users, FileText, Search } from 'lucide-react';
import './LandingPageStyles.css'
import Image from 'next/image';

export default function OnboardSectionTwo() {
  const modules = [
    { icon: CreditCard, label: 'Bank account', color: 'bg-pink-100 text-pink-600', iconBg: 'bg-pink-200' },
    { icon: Home, label: 'Ownership', color: 'bg-blue-100 text-blue-600', iconBg: 'bg-blue-200' },
    { icon: Wallet, label: 'Source of Funds', color: 'bg-amber-100 text-amber-700', iconBg: 'bg-amber-200' },
    { icon: ShieldCheck, label: 'Identity verification', color: 'bg-purple-100 text-purple-600', iconBg: 'bg-purple-200' },
    { icon: Users, label: 'Representatives', color: 'bg-cyan-100 text-cyan-600', iconBg: 'bg-cyan-200' },
    { icon: FileText, label: 'UBO', color: 'bg-green-100 text-green-600', iconBg: 'bg-green-200' },
    { icon: Search, label: 'AML Screening', color: 'bg-gray-100 text-gray-400', iconBg: 'bg-gray-200' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Optimised for conversion',
    },
    {
      icon: Info,
      title: 'First-time-right data collection',
    },
    {
      icon: Globe,
      title: 'Deep localization',
    },
  ];

  const [imageIndex, setImageIndex] = useState(1);

  return (
    <div className="min-h-screen bg-white px-6 mt-[8rem] py-20 font-[LandingFont] w-full overflow-hidden">
      <div className="max-w-[67rem] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div className="max-w-2xl">
            <div className="inline-block bg-[#f7f7f5] px-4 py-1 rounded-full mb-6">
              <span className="text-sm font-medium text-gray-700">Decide</span>
            </div>
            
            <h1 className="text-5xl leading-14 tracking-tighter mb-6">
              Save time with automated<br />case management
            </h1>
            
            <p className="text-xl text-gray-500">
              Increase compliance quality and cut costs — by reducing manual work.
            </p>
          </div>
          
          {/* <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-full hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
            <span className="font-medium text-gray-700">Explore</span>
            <ChevronRight className="w-5 h-5" />
          </button> */}
          <h1>hello</h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Right - Features */}
          <div className="">
            {/* KYB Modules Card */}
            <div className={`${imageIndex == 1 ? 'bg-[#eeece8]' : 'bg-white'} rounded-2xl cursor-pointer p-4`} onClick={() => setImageIndex(1)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="">
                  <FileText className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl text-gray-900">20+ KYB modules</h3>
              </div>
              {imageIndex == 1 && <p className="text-gray-800 tracking-tight -mt-2">
                Configure every data field to fit your enterprise needs – from ID&V to AML, KYC, and more.
              </p>}
            </div>

            {/* Conversion Modules Card */}
            <div className={`${imageIndex == 2 ? 'bg-[#eeece8]' : 'bg-white'} rounded-2xl cursor-pointer p-4`} onClick={() => setImageIndex(2)}>
              <div className="flex items-start gap-3 mb-4">
                <div className="">
                  <Zap className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl text-gray-900">Optimised for conversion</h3>
              </div>
              {imageIndex == 2 && <p className="text-gray-600 leading-relaxed">
                Configure every data field to fit your enterprise needs – from ID&V to AML, KYC, and more.
              </p>}
            </div>

            {/* Collection Modules Card */}
            <div className={`${imageIndex == 3 ? 'bg-[#eeece8]' : 'bg-white'} rounded-2xl cursor-pointer p-4`} onClick={() => setImageIndex(3)}>
              <div className="flex items-start gap-3 mb-4">
                <div className="">
                  <Info className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl text-gray-900">First-time-right data collection</h3>
              </div>
              {imageIndex == 3 && <p className="text-gray-600 leading-relaxed">
                Configure every data field to fit your enterprise needs – from ID&V to AML, KYC, and more.
              </p>}
            </div>

            {/* Localization Modules Card */}
            <div className={`${imageIndex == 4 ? 'bg-[#eeece8]' : 'bg-white'} rounded-2xl cursor-pointer p-4`} onClick={() => setImageIndex(4)}>
              <div className="flex items-start gap-3 mb-4">
                <div className="">
                  <Globe className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl text-gray-900">Deep localization</h3>
              </div>
              {imageIndex == 4 && <p className="text-gray-600 leading-relaxed">
                Configure every data field to fit your enterprise needs – from ID&V to AML, KYC, and more.
              </p>}
            </div>
          </div>

          {imageIndex == 1 && <Image src={'/OnboardingImageOne.avif'} alt='Onboarding Image' height={670} width={550} />}
          {imageIndex == 2 && <Image src={'/OnboardingImageTwo.avif'} alt='Onboarding Image' height={670} width={550} />}
          {imageIndex == 3 && <Image src={'/OnboardingImageThree.avif'} alt='Onboarding Image' height={670} width={550} />}
          {imageIndex == 4 && <Image src={'/OnboardingImageFour.avif'} alt='Onboarding Image' height={670} width={550} />}
        </div>
      </div>
    </div>
  );
}