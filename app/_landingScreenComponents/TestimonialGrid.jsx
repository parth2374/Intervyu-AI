import Image from "next/image";
import React from "react";
import './LandingPageStyles.css'

const cards = [
  // top row
  { id: 1, type: "logo", img: "/testimonials/qonto.jpg", large: false },
  { id: 2, type: "person", img: "/TestimonialTwo.avif", large: false },
  {
    id: 3,
    type: "quote",
    img: "/TestimonialThree.avif",
    logo: "/logos/plaid.svg",
    quote:
      "Business onboarding used to be a cost center for Plaid. Now, it’s a revenue driver thanks to Duna’s intuitive onboarding flows, enterprise-grade UX and minimal engineering work.",
    who: "Zak Lambert — GM EMEA, Plaid",
    large: true,
  },

  // bottom row
  {
    id: 4,
    type: "quote",
    img: "/TestimonialFour.avif",
    logo: "/logos/stripe.svg",
    quote:
      "Duna’s policy engine and architecture systems are exceptional. I wish a platform like Duna existed when we scaled Stripe across the globe.",
    who: "David Singleton — Former CTO, Stripe",
    large: true,
  },
  { id: 5, type: "logo", img: "/testimonials/sequra.jpg", large: false },
  { id: 6, type: "person", img: "/TestimonialSix.avif", large: false },
];

export default function TestimonialsGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 font-[LandingFont]">
      <header className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-normal text-gray-900 tracking-tighter">Trusted by leaders</h2>
        <p className="text-gray-500 mt-5 text-xl max-w-3xl mx-auto">
          Real interview simulations, objective feedback, and data-driven hiring — used by talent teams and professionals to hire and prepare with confidence.
        </p>
      </header>

      {/* Grid: responsive with some items spanning */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 mt-7 lg:grid-cols-7 gap-4 items-stretch"
        aria-hidden="false"
      >
        {/* We'll map cards and apply col/row spans to emulate mosaic */}
        {cards.map((c, idx) => {
          // layout rules:
          // - large cards span 3 columns on lg, otherwise full width
          // - normal cards take 2 columns on lg (so grid of 6 columns works well)
          const lgSpan = c.large ? "lg:col-span-3 lg:row-span-1" : "lg:col-span-2 lg:row-span-1";
          // small height vs large height
          const hClass = c.large ? "h-72 md:h-91" : "h-64 md:h-91";

          return (
            <div
              key={c.id}
              className={`${lgSpan} ${hClass} rounded-2xl overflow-hidden shadow-sm relative`}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={c.img}
                  alt={c.type === "person" ? "person testimonial" : `${c.type} card`}
                  layout="fill"
                  objectFit="cover"
                  className="transform-gpu"
                  priority={idx < 3} // prioritize top images
                />
                {/* subtle dark overlay for quote/readability */}
                {(c.id == 3 || c.id == 4) && <div className="absolute inset-0 bg-black/0 lg:bg-black/20 transition" />}
              </div>

              {/* Content overlay */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                {/* top row: optional 'who' and logo at top-left/right */}
                <div className="flex items-start justify-between">
                  {c.who ? (
                    <div className="text-white text-sm font-medium drop-shadow-sm">{c.who}</div>
                  ) : (
                    <div />
                  )}
                  {c.logo ? (
                    <div className="">
                      <Image src={c.logo} alt="logo" width={72} height={28} className="object-contain" />
                    </div>
                  ) : null}
                </div>

                {/* middle / bottom: quote or centered logo */}
                <div className="mt-2">
                  {c.type === "quote" ? (
                    <blockquote className="text-white text-base md:text-lg leading-relaxed drop-shadow-lg">
                      “{c.quote}”
                    </blockquote>
                  ) : c.type === "logo" ? (
                    <div className="flex items-center justify-center h-full">
                      {c.logo && <Image src={c.logo} alt="company logo" width={160} height={60} className="object-contain" />}
                    </div>
                  ) : (
                    // person card: small logo bottom-left
                    <div className="flex items-end h-full">
                      {/* empty - design shows person photo prominently */}
                    </div>
                  )}
                </div>

                {/* bottom-right small circular button */}
                <div className="flex justify-end">
                  <button
                    aria-label="more"
                    className="w-9 h-9 rounded-full bg-white/90 text-gray-700 flex items-center justify-center shadow-sm hover:scale-105 transition"
                  >
                    <span className="text-lg font-bold">+</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}