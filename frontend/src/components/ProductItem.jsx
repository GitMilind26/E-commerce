import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const ProductItem = ({ id, name, price, images, image, category, subCategory, ratings }) => {
  const { currency, getProductImage, addToCart } = useContext(ShopContext)

  // Package a dummy product object to pass to the helper
  const imgUrl = getProductImage({ images, image }, 0)

  const handleAddToCart = (e) => {
    e.preventDefault() // prevent navigating to details page
    addToCart(id, 'M', 'Black')
  }

  // Generate dynamic stars layout
  const starCount = Math.round(ratings || 4) // default to 4 stars for mock feel

  return (
    <Link to={`/product/${id}`} className='group block text-gray-800 bg-white hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden border border-gray-50'>
      {/* Product Image Frame */}
      <div className='relative overflow-hidden aspect-[3/4] bg-[#F7F7F8] flex items-center justify-center p-3'>
        <img
          className='w-full h-full object-contain group-hover:scale-105 transition-all duration-500 ease-out mix-blend-multiply'
          src={imgUrl}
          alt={name}
        />
        {/* Soft overlay on hover */}
        <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        
        {/* Quick Add Overlay Button */}
        <button
          onClick={handleAddToCart}
          className='absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-xs text-white text-[10px] tracking-wider uppercase font-semibold py-3.5 rounded-xl translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black'
        >
          Quick Add
        </button>
      </div>
      
      {/* Product Information */}
      <div className='p-4 flex flex-col gap-1.5'>
        {/* Category Tag */}
        <span className='text-[10px] text-gray-400 font-bold uppercase tracking-wider'>
          {subCategory || 'Clothing'}
        </span>
        
        {/* Name */}
        <h3 className='text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-black transition-colors'>
          {name}
        </h3>
        
        {/* Price & Rating */}
        <div className='flex items-center justify-between mt-1'>
          <p className='text-xs font-bold text-gray-900'>{currency}{price}</p>
          
          <div className='flex gap-0.5'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < starCount ? assets.star_icon : assets.star_dull_icon}
                alt=""
                className='w-2.5 opacity-80'
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
