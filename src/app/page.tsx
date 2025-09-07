import React from 'react'
import Homepage from '@/components/Homepage'
import ProblemsPage from '@/components/Problems'
export default function page() {
  return (
    <div className='min-h-screen bg-sky-50'>
      <Homepage/>
      <ProblemsPage/>
    </div>
  )
}
