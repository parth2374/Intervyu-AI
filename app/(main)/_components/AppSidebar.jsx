'use client'

import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { SideBarOptions } from '@/services/Constants'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const AppSidebar = () => {
  const path = usePathname()
  const { user } = useAuthContext()
  const router = useRouter()

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="flex items-center bg-white dark:bg-[#030712] p-4">
        <Image
          src={'/logo.png'}
          alt="logo"
          width={200}
          height={100}
          className="w-[150px] mt-1 block dark:hidden"
        />
				<Image
					src="/transparent_bg_logo_white.png"
					alt="logo dark"
					width={130}
					height={100}
					className="hidden dark:block"
				/>
        <Link href={'/dashboard/create-interview'} className="w-full">
          <Button className="w-full mt-5 cursor-pointer">
            <Plus /> Create New Interview
          </Button>
        </Link>
      </SidebarHeader>

      {/* Content / Menu */}
      <SidebarContent className="bg-white dark:bg-[#030712]">
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => (
                <SidebarMenuItem key={index} className="p-1">
                  <SidebarMenuButton
                    asChild
                    className={`p-5 ${path == option.path ? 'bg-blue-50 dark:bg-blue-500' : ''}`}
                  >
                    <Link href={option.path} className="flex items-center gap-3">
                      {/* Icon */}
                      <option.icon
												className={
													`${path === option.path
														? 'text-primary font-medium'
														: 'text-gray-600 dark:text-gray-300'
													} w-5.5! h-5.5!`
												}
											/>
                      {/* Text */}
                      <span
                        className={
                          'text-[16px] ' + (path == option.path ? 'text-primary font-medium' : 'text-gray-800 dark:text-gray-200')
                        }
                      >
                        {option?.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-4 pt-4 pb-3">
        <div className="w-full bg-gray-200 dark:bg-[#030712] p-4 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            {/* diamond icon */}
            <Image src={'/diamond.webp'} alt="Credits" height={20} width={20} />

            <div className="flex">
              <div className="text-sm text-gray-700 dark:text-gray-300">Remaining Credits: </div>
              <div className="text-sm font-bold ml-1 text-black dark:text-white">
                {user?.credits ?? 0}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <Button
              onClick={() => router.push('/billing')}
              className="w-full bg-[#0377fc] hover:opacity-95 text-white dark:bg-white dark:text-black"
            >
              Add Credits
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 mb-2">
          <Image
            src={user?.picture ?? '/default-avatar.png'}
            alt="User Image"
            className="rounded-full"
            height={35}
            width={35}
          />
          <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
            <span className="mr-1">🚀</span>
            <span className="text-gray-600 dark:text-gray-400">Powered by </span>
            <span className="ml-1 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-500">
              RAMORAE AI
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar