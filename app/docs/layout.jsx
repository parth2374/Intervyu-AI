import React from 'react'
import DocsProvider from './provider'

const DocsLayout = ({ children }) => {
  return (
    <DocsProvider>
      <div>
        {children}
      </div>
    </DocsProvider>
  )
}

export default DocsLayout