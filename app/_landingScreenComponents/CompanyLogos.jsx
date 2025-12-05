"use client";

import Image from "next/image";
import './LandingPageStyles.css'

export default function CompanyLogos() {
  const logos = [
    "/google.png",
    "/ibm.png",
    "/symphony.png",
    "/veeva.png",
    "/naunce.png",
    "/algolia.png",
    "/tamr.png",
    "/microsoft.png",
    "/palantir.png",
    "/samsara.png",
    "/sift.png",
    "/eightfold.png",
    "/nuro.png",
    "/nvidia.png",
    "/amazon.png",
  ];

  return (
    <section className="mt-32 bg-white border-t border-gray-100 font-[LandingFont]">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-500 mb-8">
          Trusted by companies redefining the future of hiring
        </p>

        <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
          {logos.map((logo, index) => (
            <Image
              key={index}
              src={logo}
              alt={`Logo ${index + 1}`}
              width={index == 5 ? 200 : 100}
              height={index == 5 ? 800 : 40}
              className="h-8 w-auto grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>

        <div className="mt-36 border-t border-gray-200 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-24">
            <div>
              <h3 className="text-[2.75rem] text-gray-900">12.4x</h3>
              <p className="text-gray-400 text-lg mt-1">Faster candidate screening</p>
            </div>
            <div className="border-t md:border-t-0 md:border-l md:border-r border-gray-200 px-6">
              <h3 className="text-[2.75rem] text-gray-900">45%</h3>
              <p className="text-gray-400 text-lg mt-1">Increase in hiring efficiency</p>
            </div>
            <div>
              <h3 className="text-[2.75rem] text-gray-900">5.2x</h3>
              <p className="text-gray-400 text-lg mt-1">Improved recruiter productivity</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}