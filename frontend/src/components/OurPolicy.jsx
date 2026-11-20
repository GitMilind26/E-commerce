import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm text-gray-700 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm my-16'>
      <div className='flex flex-col items-center gap-3'>
        <img src={assets.exchange_icon} className='w-10 mb-2 opacity-80' alt="" />
        <p className='font-bold text-gray-800 tracking-wide uppercase text-[11px]'>Easy Exchange Policy</p>
        <p className='text-gray-400'>We offer a hassle-free 7-day exchange policy on all apparel.</p>
      </div>
      <div className='flex flex-col items-center gap-3 border-y sm:border-y-0 sm:border-x border-gray-100 py-8 sm:py-0 sm:px-12'>
        <img src={assets.quality_icon} className='w-10 mb-2 opacity-80' alt="" />
        <p className='font-bold text-gray-800 tracking-wide uppercase text-[11px]'>30 Days Return</p>
        <p className='text-gray-400'>Return any unworn, unwashed item with tags attached within 30 days.</p>
      </div>
      <div className='flex flex-col items-center gap-3'>
        <img src={assets.support_img} className='w-10 mb-2 opacity-80' alt="" />
        <p className='font-bold text-gray-800 tracking-wide uppercase text-[11px]'>Premium Customer Support</p>
        <p className='text-gray-400'>Our support team is available 24/7 to guide you through your order.</p>
      </div>
    </div>
  )
}

export default OurPolicy
