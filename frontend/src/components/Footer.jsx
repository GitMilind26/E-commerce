import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Thank you for subscribing to our newsletter!')
    setEmail('')
  }

  return (
    <footer className='mt-24 border-t border-gray-200 bg-white pt-16 pb-8'>
      {/* Newsletter Section */}
      <div className='flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mb-16'>
        <h3 className='prata-regular text-2xl md:text-3xl text-gray-800 mb-2'>Subscribe to our newsletter</h3>
        <p className='text-gray-500 text-sm md:text-base max-w-md mb-6'>
          Get 15% off your first purchase and stay updated on the latest arrivals and collections.
        </p>
        <form onSubmit={handleSubscribe} className='flex w-full max-w-md items-center border border-gray-300 rounded-full p-1 bg-white hover:border-black transition-all shadow-sm'>
          <input
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email address'
            className='w-full px-4 outline-none text-sm text-gray-700 bg-transparent'
          />
          <button
            type='submit'
            className='bg-black hover:bg-gray-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap'
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Main Footer Links */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-12 px-6 max-w-7xl mx-auto border-b border-gray-100 pb-12 text-sm text-gray-600'>
        {/* Brand details */}
        <div className='md:col-span-1 flex flex-col gap-4'>
          <img src={assets.logo} alt='Logo' className='w-32' />
          <p className='leading-relaxed text-gray-500'>
            Elevated essentials designed for modern living. Crafted with minimal design principles and sustainable materials.
          </p>
        </div>

        {/* Shop links */}
        <div>
          <h4 className='font-bold text-gray-800 mb-4 tracking-wider uppercase text-xs'>Shop</h4>
          <ul className='flex flex-col gap-2'>
            <li><Link to='/collection' className='hover:text-black transition-all'>New Arrivals</Link></li>
            <li><Link to='/collection' className='hover:text-black transition-all'>Bestsellers</Link></li>
            <li><Link to='/collection' className='hover:text-black transition-all'>Men's Apparel</Link></li>
            <li><Link to='/collection' className='hover:text-black transition-all'>Women's Apparel</Link></li>
          </ul>
        </div>

        {/* Support links */}
        <div>
          <h4 className='font-bold text-gray-800 mb-4 tracking-wider uppercase text-xs'>Support</h4>
          <ul className='flex flex-col gap-2'>
            <li><Link to='/contact' className='hover:text-black transition-all'>Contact Us</Link></li>
            <li><Link to='/about' className='hover:text-black transition-all'>About Our Brand</Link></li>
            <li><a href='#' className='hover:text-black transition-all'>Shipping & Returns</a></li>
            <li><a href='#' className='hover:text-black transition-all'>Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className='font-bold text-gray-800 mb-4 tracking-wider uppercase text-xs'>Get In Touch</h4>
          <ul className='flex flex-col gap-2'>
            <li>Phone: +1 (555) 234-5678</li>
            <li>Email: customercare@ecommerce.com</li>
            <li className='mt-2 flex gap-4'>
              {/* Mock social icons */}
              <a href='#' className='w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all'>
                <span className='font-bold text-xs'>Fb</span>
              </a>
              <a href='#' className='w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all'>
                <span className='font-bold text-xs'>Ig</span>
              </a>
              <a href='#' className='w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all'>
                <span className='font-bold text-xs'>Tw</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copy info */}
      <div className='text-center text-xs text-gray-400 mt-8'>
        &copy; {new Date().getFullYear()} Modern E-Commerce. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
