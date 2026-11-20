import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600',
      label: 'URBAN EDGE',
      title: 'Jackets for the\nModern Man',
      buttonText: 'Discovery Now'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600',
      label: 'SUMMER DROP',
      title: 'Enchanting Linen\nApparel',
      buttonText: 'Explore Collection'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600',
      label: 'OFFICE CHIC',
      title: 'Tailored Blazer\nCollection',
      buttonText: 'Shop Now'
    }
  ]

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleShopRedirect = () => {
    navigate('/collection')
  }

  return (
    <div className='relative w-full h-[85vh] min-h-[500px] overflow-hidden rounded-3xl mt-4 shadow-md bg-gray-900 flex items-center justify-between'>
      
      {/* Slides mapping with crossfade opacity transition */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentSlide
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background image */}
            <div 
              className='absolute inset-0 bg-cover bg-center brightness-[0.95]'
              style={{ backgroundImage: `url('${slide.image}')` }}
            />
            {/* Soft gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/15' />

            {/* Content overlay */}
            <div className='absolute left-10 md:left-24 top-1/2 -translate-y-1/2 max-w-lg text-white flex flex-col items-start gap-4'>
              <p className={`text-xs font-bold tracking-[0.25em] uppercase text-white/90 drop-shadow-sm transition-all duration-700 delay-300 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {slide.label}
              </p>
              <h1 className={`prata-regular text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-wide drop-shadow-md whitespace-pre-line transition-all duration-700 delay-500 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                {slide.title}
              </h1>
              <button 
                onClick={handleShopRedirect}
                className={`bg-white text-black font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300 mt-2 ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                {slide.buttonText}
              </button>
            </div>
          </div>
        )
      })}

      {/* Manual Left Navigation Arrow */}
      <button 
        onClick={prevSlide}
        className='absolute left-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition hover:scale-105 active:scale-95 duration-200 hidden sm:flex z-20'
      >
        <svg className='w-5 h-5 stroke-current fill-none' strokeWidth='2' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      {/* Manual Right Navigation Arrow */}
      <button 
        onClick={nextSlide}
        className='absolute right-6 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition hover:scale-105 active:scale-95 duration-200 hidden sm:flex z-20'
      >
        <svg className='w-5 h-5 stroke-current fill-none' strokeWidth='2' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20'>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

    </div>
  )
}

export default Hero