// "use client"

// import React, { useEffect, useState } from 'react'
// import PayButton from './_components/PayButton'
// import { supabase } from '@/services/supabaseClient'
// import { useAuthContext } from '@/app/provider'
// import { Loader } from 'lucide-react'
// import { useRouter } from 'next/navigation'

// export default function Billing() {
//   const [userCredits, setUserCredits] = useState()
//   const { user } = useAuthContext()
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     if (!user) {
//       router.push('/auth')
//     }
//   }, [user])

//   useEffect(() => {
//     user && GetUserInfo()
//   }, [user])

//   const GetUserInfo = async () => {
//     setLoading(true)
//     let { data, error } = await supabase
//       .from('Users')
//       .select('credits')
//       .eq('email', user?.email)

//     const credits = data[0]?.credits
//     setUserCredits(credits)
//     console.log("Credits")
//     console.log(data)
//     setLoading(false)
//   }
  
//   const creditsLeft = userCredits
//   const plans = [
//     {
//       id: 'basic',
//       title: 'Basic',
//       price: '5',
//       subtitle: '20 interviews',
//       bullets: ['Basic interview templates', 'Email support'],
//       credits: 20
//     },
//     {
//       id: 'standard',
//       title: 'Standard',
//       price: '12',
//       subtitle: '50 interviews',
//       bullets: ['All interview templates', 'Priority support', 'Basic analytics'],
//       featured: true,
//       credits: 50
//     },
//     {
//       id: 'pro',
//       title: 'Pro',
//       price: '25',
//       subtitle: '120 interviews',
//       bullets: ['All interview templates', '24/7 support', 'Advanced analytics'],
//       credits: 120
//     },
//   ]

//   return (
//     <div className="mt-5">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
//           <p className="mt-1 text-sm text-gray-500">Manage your Payment and credits</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* Left column: Credits card */}
//           {!loading ?
//             <aside className="lg:col-span-4">
//               <div className="bg-white border rounded-xl p-6 shadow-sm">
//                 <h3 className="text-lg font-semibold text-gray-800">Your Credits</h3>
//                 <p className="text-sm text-gray-500 mt-1">Current usage and remaining credits</p>

//                 <div className="mt-6">
//                   <div className="flex items-center gap-4 bg-gray-50 border rounded-lg p-4">
//                     <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
//                       {/* simple card icon */}
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h.01M17 15h.01M7 7h.01M17 7h.01" />
//                       </svg>
//                     </div>

//                     <div className="flex-1">
//                       <div className="text-sm font-semibold text-blue-700">{creditsLeft} interviews left</div>
//                       <div className="text-xs text-gray-400">Remaining credits in your account</div>
//                     </div>
//                   </div>

//                   <button
//                     type="button"
//                     className="mt-6 w-full inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     + Add More Credits
//                   </button>

//                   <div className="mt-6 text-xs text-gray-400">
//                     <p>Current plan usage: <span className="font-medium text-gray-700">{creditsLeft} / 3</span></p>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//             :
//             <div className='lg:col-span-4 border flex justify-center items-center h-40'><Loader className='animate-spin' /></div>
//           }

//           {/* Right column: Purchase cards */}
//           <main className="lg:col-span-8">
//             <div className="bg-white border rounded-xl p-6 shadow-sm">
//               <h3 className="text-lg font-semibold text-gray-800">Purchase Credits</h3>
//               <p className="text-sm text-gray-500 mt-1">Add more interview credits to your account</p>

//               <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {plans.map((plan) => (
//                   <article
//                     key={plan.id}
//                     className={`relative rounded-lg border p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-150 ${plan.featured ? 'border-blue-200 bg-blue-50' : 'bg-white'}`}
//                   >
//                     {plan.featured && (
//                       <div className="absolute -top-3 left-4 text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium">Best value</div>
//                     )}

//                     <div>
//                       <h4 className="text-sm font-semibold text-gray-700">{plan.title}</h4>
//                       <div className="mt-3 flex flex-col gap-3">
//                         <div className="text-3xl font-bold text-gray-900">${plan.price}</div>
//                         <div className="text-sm text-gray-500">{plan.subtitle}</div>
//                       </div>

//                       <ul className="mt-4 space-y-2 text-sm text-gray-600">
//                         {plan.bullets.map((b, i) => (
//                           <li key={i} className="flex items-start gap-2">
//                             <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-blue-600" />
//                             <span>{b}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div className="mt-6">
//                       <PayButton amount={plan?.price} credits={plan?.credits} />
//                     </div>
//                   </article>
//                 ))}
//               </div>
//             </div>

//             {/* Billing summary / small note under cards */}
//             <div className="mt-6 p-4 text-sm text-gray-600 rounded-lg">
//               <p>
//                 Payments are handled securely. After purchase, credits are added to your account immediately and can be used for interviews.
//               </p>
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import React, { useEffect, useState } from 'react'
import PayButton from './_components/PayButton'
import { supabase } from '@/services/supabaseClient'
import { useAuthContext } from '@/app/provider'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Billing() {
  const [userCredits, setUserCredits] = useState()
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user])

  useEffect(() => {
    if (user) GetUserInfo()
  }, [user])

  const GetUserInfo = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('Users')
        .select('credits')
        .eq('email', user?.email)

      if (error) throw error
      const credits = data?.[0]?.credits ?? 0
      setUserCredits(credits)
    } catch (err) {
      console.error('Failed to fetch user info', err)
      setUserCredits(0)
    } finally {
      setLoading(false)
    }
  }
  
  const creditsLeft = userCredits ?? '—'
  const plans = [
    {
      id: 'basic',
      title: 'Basic',
      price: '5',
      subtitle: '20 interviews',
      bullets: ['Basic interview templates', 'Email support'],
      credits: 20
    },
    {
      id: 'standard',
      title: 'Standard',
      price: '12',
      subtitle: '50 interviews',
      bullets: ['All interview templates', 'Priority support', 'Basic analytics'],
      featured: true,
      credits: 50
    },
    {
      id: 'pro',
      title: 'Pro',
      price: '25',
      subtitle: '120 interviews',
      bullets: ['All interview templates', '24/7 support', 'Advanced analytics'],
      credits: 120
    },
  ]

  return (
    <div className="mt-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Billing</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your Payment and credits</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column: Credits card */}
          {!loading ?
            <aside className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Credits</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current usage and remaining credits</p>

                <div className="mt-6">
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/40 border border-transparent rounded-lg p-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      {/* simple card icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h.01M17 15h.01M7 7h.01M17 7h.01" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">{creditsLeft} interviews left</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Remaining credits in your account</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-6 w-full inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    + Add More Credits
                  </button>

                  <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                    <p>Current plan usage: <span className="font-medium text-gray-700 dark:text-gray-200">{creditsLeft} / 3</span></p>
                  </div>
                </div>
              </div>
            </aside>
            :
            <div className='lg:col-span-4 border border-gray-200 dark:border-gray-700 flex justify-center items-center h-40'><Loader className='animate-spin text-gray-500 dark:text-gray-400' /></div>
          }

          {/* Right column: Purchase cards */}
          <main className="lg:col-span-8 dark:border rounded-2xl">
            <div className="bg-white dark:bg-transparent border border-gray-200 dark:border-transparent rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Purchase Credits</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add more interview credits to your account</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <article
                    key={plan.id}
                    className={`relative rounded-lg border p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-150 ${plan.featured ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3 left-4 text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium">Best value</div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-100">{plan.title}</h4>
                      <div className="mt-3 flex flex-col gap-3">
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">${plan.price}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{plan.subtitle}</div>
                      </div>

                      <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {plan.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-blue-600" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <PayButton amount={plan?.price} credits={plan?.credits} />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Billing summary / small note under cards */}
            <div className="mt-6 p-4 text-sm text-gray-600 dark:text-gray-300 rounded-lg">
              <p>
                Payments are handled securely. After purchase, credits are added to your account immediately and can be used for interviews.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}