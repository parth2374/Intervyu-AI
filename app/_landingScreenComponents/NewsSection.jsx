'use client'

import React, { useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import './LandingPageStyles.css'

export default function NewsSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const newsItems = [
    {
      id: 1,
      title: "A note from our founding engineers",
      category: "Company",
      duration: "6 min read",
      image: "url('/NewsOne.avif')"
    },
    {
      id: 2,
      title: "Duna Conversations with Plaid GM Zak Lambert",
      category: "Company",
      duration: "19 min watch"
    },
    {
      id: 3,
      title: "Duna Conversations with Stripe COO Claire Hughes Johnson",
      category: "Conversations",
      duration: "19 min watch"
    }
  ];

  return (
    <div className="min-h-screen py-16 mt-10 px-6 font-[LandingFont]">
      <div className="max-w-[67rem] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-[2.5rem] text-gray-900">News</h1>
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors group">
            <span className="text-lg">See more</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Image */}
              <div className={`relative h-90 rounded-3xl overflow-hidden mb-6 transition-all duration-300`}>
                <div className={`absolute inset-0`}>
                  {item.id === 1 && (
                    <div className={`absolute bg-[url('/NewsOne.avif')] bg-cover bg-center inset-0 flex items-center justify-center`}>
                      <div className="text-white text-center">
                      </div>
                    </div>
                  )}
                  
                  {item.id === 2 && (
                    <div className="absolute inset-0">
                      {/* Logo */}
                      <div className="absolute bg-[url('/NewsTwo.avif')] bg-cover bg-center inset-0 flex items-center justify-center">
                      </div>
                    </div>
                  )}
                  
                  {item.id === 3 && (
                    <div className="absolute bg-[url('/NewsThree.avif')] bg-cover bg-center inset-0 flex items-end justify-center">
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="px-2">
                <h3 className="text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium text-xs">{item.category}</span>
                  <span className="text-gray-400">—</span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-4 h-4" />
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}