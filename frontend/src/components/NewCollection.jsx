import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'

const NewCollection = () => {
  const { products } = useContext(ShopContext)
  const [activeTab, setActiveTab] = useState('WOMEN')
  const [filteredProducts, setFilteredProducts] = useState([])

  const tabs = ['WOMEN', 'MEN', 'SHOES', 'BAGS', 'ACCESSORIES']

  useEffect(() => {
    if (products && products.length > 0) {
      let filtered = []
      
      switch (activeTab) {
        case 'WOMEN':
          filtered = products.filter(item => item.category === 'Women')
          break
        case 'MEN':
          filtered = products.filter(item => item.category === 'Men')
          break
        case 'SHOES':
          filtered = products.filter(item => item.category === 'Shoes')
          break
        case 'BAGS':
          filtered = products.filter(item => item.category === 'Bags')
          break
        case 'ACCESSORIES':
          filtered = products.filter(item => item.category === 'Accessories')
          break
        default:
          filtered = products
      }
      
      // Fallback in case backend fetch is not completed/offline to use static Kids/Apparel categories
      if (filtered.length === 0) {
        if (activeTab === 'SHOES') filtered = products.filter(item => item.category === 'Kids')
        else if (activeTab === 'BAGS') filtered = products.filter(item => item.subCategory === 'Bottomwear')
        else if (activeTab === 'ACCESSORIES') filtered = products.filter(item => item.subCategory === 'Winterwear')
      }
      
      // Limit to 8 items to fit a clean 4x2 grid
      setFilteredProducts(filtered.slice(0, 8))
    }
  }, [products, activeTab])

  return (
    <div className='my-24 text-gray-800 animate-fade-in'>
      
      {/* Title */}
      <div className='text-center mb-8'>
        <h2 className='prata-regular text-3xl font-medium tracking-wider text-gray-900'>
          New Arrivals
        </h2>
      </div>

      {/* Interactive Tabs */}
      <div className='flex justify-center items-center gap-6 sm:gap-10 text-[10px] sm:text-xs font-semibold tracking-widest text-gray-400 mb-12 border-b border-gray-100 pb-4 max-w-2xl mx-auto'>
        {tabs.map(tab => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`hover:text-black transition-all pb-4 relative ${
                isActive ? 'text-black font-bold' : ''
              }`}
            >
              {tab}
              {isActive && (
                <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-black transition-all duration-300' />
              )}
            </button>
          )
        })}
      </div>

      {/* 4-Column Grid Layout */}
      {filteredProducts.length === 0 ? (
        <div className='text-center py-16 text-gray-400 text-sm font-medium'>
          No items found in this collection.
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8 max-w-7xl mx-auto'>
          {filteredProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              images={item.images}
              image={item.image}
              category={item.category}
              subCategory={item.subCategory}
              ratings={item.ratings}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default NewCollection
