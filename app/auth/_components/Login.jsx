"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import Authentication from '@/app/_components/Authentication';
import { useAuthContext } from '@/app/provider';

const Login = () => {

	const { user } = useAuthContext()
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (user) {
			router.push('/dashboard') // default fallback
		}
	}, [user])

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<div className='flex flex-col items-center border rounded-2xl p-8'>
				<Image src={'/logo.png'} alt='logo' width={400} height={100} className='w-[180px]' />
				<div className='flex items-center flex-col'>
					<Image src={'/login.webp'} alt='login' width={600} height={400} className='w-[400px] h-[250px] rounded-2xl' />
					<h2 className='text-2xl font-bold text-center mt-5'>Welcome back</h2>
					<p className='text-gray-500 text-center'>Login with your Apple or Google account</p>

					<Authentication>
						<Button className="mt-7 w-full cursor-pointer gap-4">
							{!user ? <><FcGoogle /> Login with Google</> : <Loader className='animate-spin' />}
						</Button>
					</Authentication>
				</div>
			</div>
		</div>
	)
}

export default Login