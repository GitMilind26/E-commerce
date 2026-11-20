import React, { useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleMessageSubmit = (e) => {
    e.preventDefault()
    toast.success('Your message has been sent successfully! We will get back to you shortly.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className='border-t border-gray-100 pt-10 text-gray-800 animate-fade-in'>
      
      <div className='text-2xl text-center mb-10'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 justify-center items-center'>
        
        {/* Left Side: Contact Information */}
        <div className='flex-1 flex flex-col gap-6 md:max-w-[450px]'>
          <img className='w-full rounded-3xl shadow-md object-cover bg-gray-50' src={assets.contact_img} alt="Contact Office" />
          <div className='flex flex-col gap-2 text-sm text-gray-600 leading-relaxed mt-4'>
            <h3 className='font-bold text-gray-800 text-base'>Our Showroom</h3>
            <p>128 Minimalist Boulevard, Suite 400<br />Soho, New York, NY 10012</p>
            <p>Phone: +1 (555) 234-5678<br />Email: hello@minimalecommerce.com</p>
            
            <h3 className='font-bold text-gray-800 text-base mt-4'>Careers</h3>
            <p className='text-gray-500'>Learn more about our team and current openings.</p>
            <button className='border border-black hover:bg-black hover:text-white transition duration-300 rounded-xl px-6 py-3 text-xs font-semibold w-fit mt-2'>
              Explore Careers
            </button>
          </div>
        </div>

        {/* Right Side: Message Submission Form */}
        <div className='flex-1 w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-sm max-w-lg'>
          <h3 className='font-bold text-gray-800 mb-6 tracking-wide uppercase text-xs'>Send us a message</h3>
          <form onSubmit={handleMessageSubmit} className='flex flex-col gap-4 text-sm'>
            
            <div className='flex flex-col gap-1'>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <textarea
                required
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we help you? Write your message here..."
                className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition resize-none leading-relaxed bg-white'
              ></textarea>
            </div>

            <button
              type="submit"
              className='bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-md mt-2'
            >
              Send Message
            </button>
          </form>
        </div>

      </div>

    </div>
  )
}

export default Contact
