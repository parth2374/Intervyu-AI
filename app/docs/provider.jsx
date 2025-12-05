import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import DocsSidebar from './_components/DocsSidebar'

const DocsProvider = ({ children }) => {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <div className='w-[calc(100vw-16rem)] ml-[16rem] p-10'>
        {children}
      </div>
    </SidebarProvider>
  )
}

export default DocsProvider