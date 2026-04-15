import React from 'react'
import HeroSection from './_landingScreenComponents/HeroSection'
import CompanyLogos from './_landingScreenComponents/CompanyLogos'
import FeaturesSection from './_landingScreenComponents/FeaturesSection'
import Footer from './_landingScreenComponents/Footer'
import TestimonialsGrid from './_landingScreenComponents/TestimonialGrid'
import NewsSection from './_landingScreenComponents/NewsSection'
import SafeSecureSection from './_landingScreenComponents/SafeSecureSection'
import PolicyEngineDiagram from './_landingScreenComponents/PolicyEngineDiagram'
import OnboardSection from './_landingScreenComponents/OnboardSection'
import OnboardSectionTwo from './_landingScreenComponents/OnboardSectionTwo'

const Home = () => {
  return (
    <div className='bg-white'>
      <HeroSection />
      <CompanyLogos />
      <FeaturesSection />
      <TestimonialsGrid />
      {/* <PolicyEngineDiagram /> */}
      <OnboardSection />
      <OnboardSectionTwo />
      <OnboardSection />
      <OnboardSectionTwo />
      <SafeSecureSection />
      <NewsSection />
      <Footer />
    </div>
  )
}

export default Home