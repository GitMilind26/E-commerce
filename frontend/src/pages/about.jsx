import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='border-t border-gray-100 pt-10 text-gray-800 animate-fade-in'>
      
      <div className='text-2xl text-center mb-10'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
        <img className='w-full md:max-w-[450px] rounded-3xl shadow-md object-cover bg-gray-50' src={assets.about_img} alt="About Us" />
        <div className='flex flex-col justify-center gap-6 md:w-1/2 text-gray-600 text-sm leading-relaxed'>
          <p>
            Welcome to our brand. We are a contemporary clothing design house committed to tailoring minimal, clean, and elevated closet staples. Guided by the principles of modern aesthetics and architectural lines, we craft timeless clothing that transcends seasonal cycles.
          </p>
          <p>
            Our manufacturing processes prioritize organic cottons, sustainable linens, and recycled technical fibers. Each piece is constructed with exceptional focus on quality craftsmanship, structural longevity, and soft textures.
          </p>
          <h3 className='font-bold text-gray-800 text-base mt-4'>Our Mission</h3>
          <p>
            We aim to simplify dressing by offering versatile capsules that seamlessly blend into your routine. By marrying premium fabrics with clean neutral tones, we encourage conscious curation—fewer items, better design.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className='text-xl py-4 mt-20 text-center'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 my-10 text-xs sm:text-sm'>
        <div className='border border-gray-100 bg-white rounded-3xl p-8 hover:shadow-md transition duration-300 flex flex-col gap-3'>
          <b className='text-gray-800 uppercase tracking-wide text-xs'>Quality Assurance</b>
          <p className='text-gray-500 leading-normal'>We meticulously check every seam, fiber weave, and button thread before wrapping your parcel.</p>
        </div>
        <div className='border border-gray-100 bg-white rounded-3xl p-8 hover:shadow-md transition duration-300 flex flex-col gap-3'>
          <b className='text-gray-800 uppercase tracking-wide text-xs'>Conscious Curation</b>
          <p className='text-gray-500 leading-normal'>Our capsules are modular and cohesive, allowing you to create multiple styling fits with minimal items.</p>
        </div>
        <div className='border border-gray-100 bg-white rounded-3xl p-8 hover:shadow-md transition duration-300 flex flex-col gap-3'>
          <b className='text-gray-800 uppercase tracking-wide text-xs'>Fast Customer Service</b>
          <p className='text-gray-500 leading-normal'>Enjoy round-the-clock email and messaging support for your shipping, return, and sizing inquiries.</p>
        </div>
      </div>

    </div>
  )
}

export default About
