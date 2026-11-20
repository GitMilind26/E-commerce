import React from 'react'
import { useNavigate } from 'react-router-dom'

const PromoGrid = () => {
  const navigate = useNavigate()

  const handleRedirect = () => {
    navigate('/collection')
  }

  return (
    <div className='my-24 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto px-1'>
      
      {/* Column 1: Tall Card (Left) */}
      <div 
        onClick={handleRedirect}
        className='relative overflow-hidden rounded-3xl group cursor-pointer aspect-[4/5] lg:aspect-auto lg:h-[650px] bg-gray-100 shadow-sm border border-gray-50'
      >
        <div 
          className='absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-500 ease-out brightness-[0.9]'
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800')`
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
        
        {/* Content */}
        <div className='absolute bottom-10 left-10 text-white flex flex-col items-start gap-2.5 max-w-xs'>
          <span className='text-[10px] font-bold tracking-[0.2em] uppercase text-white/80'>
            ETHEREAL ELEGANCE
          </span>
          <h2 className='prata-regular text-2xl md:text-3xl leading-snug'>
            Where Dreams Meet Couture
          </h2>
          <button className='text-xs font-semibold uppercase tracking-wider underline underline-offset-4 hover:opacity-80 transition mt-2'>
            Shop Now
          </button>
        </div>
      </div>

      {/* Column 2: Stack Grid (Right) */}
      <div className='flex flex-col gap-6 justify-between'>
        
        {/* Top: Wide Card */}
        <div 
          onClick={handleRedirect}
          className='relative overflow-hidden rounded-3xl group cursor-pointer h-[310px] bg-gray-100 shadow-sm border border-gray-50'
        >
          <div 
            className='absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-500 ease-out brightness-[0.9]'
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=800')`
            }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
          
          {/* Content */}
          <div className='absolute bottom-8 left-8 text-white flex flex-col items-start gap-2 max-w-sm'>
            <span className='text-[10px] font-bold tracking-[0.2em] uppercase text-white/80'>
              RADIANT REVERIE
            </span>
            <h2 className='prata-regular text-xl md:text-2xl leading-snug'>
              Enchanting Styles for Every Woman
            </h2>
            <button className='text-xs font-semibold uppercase tracking-wider underline underline-offset-4 hover:opacity-80 transition mt-1'>
              Shop Now
            </button>
          </div>
        </div>

        {/* Bottom: Two Squares row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          
          {/* Bottom Left Square: Sneaker */}
          <div 
            onClick={handleRedirect}
            className='relative overflow-hidden rounded-3xl group cursor-pointer h-[316px] bg-[#F3F4F6] border border-gray-50 flex items-center justify-center p-6'
          >
            <div 
              className='absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-500 ease-out mix-blend-multiply brightness-[0.95] opacity-90'
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600')`
              }}
            />
            
            {/* Content */}
            <div className='absolute bottom-6 left-6 text-black flex flex-col items-start gap-1.5 max-w-[200px]'>
              <span className='text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500'>
                URBAN STRIDES
              </span>
              <h3 className='font-bold text-sm text-gray-900 leading-normal'>
                Chic Footwear for City Living
              </h3>
              <button className='text-[10px] font-bold uppercase tracking-wider underline underline-offset-2 hover:opacity-80 transition mt-1'>
                Shop Now
              </button>
            </div>
          </div>

          {/* Bottom Right Square: Solid Indigo 50% Banner */}
          <div 
            onClick={handleRedirect}
            className='relative overflow-hidden rounded-3xl group cursor-pointer h-[316px] bg-[#1E3B5E] text-white p-8 flex flex-col justify-between hover:bg-[#1A3453] transition-colors duration-300'
          >
            <div className='flex flex-col gap-2'>
              <span className='text-[10px] font-bold tracking-[0.2em] uppercase text-white/70'>
                URBAN STRIDES
              </span>
              <h3 className='prata-regular text-lg leading-snug text-white/90'>
                Trendsetting Bags for Her
              </h3>
            </div>
            
            <div className='flex flex-col items-start gap-4'>
              <span className='prata-regular text-6xl font-normal tracking-wider'>
                50%
              </span>
              <button className='text-xs font-semibold uppercase tracking-wider underline underline-offset-4 hover:opacity-85 transition'>
                Shop Now
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default PromoGrid
