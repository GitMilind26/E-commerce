import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  const [bestseller, setBestseller] = useState([])

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProduct = products.filter((item) => item.bestseller)
      setBestseller(bestProduct.slice(0, 4))
    }
  }, [products])

  return (
    <div className='my-20'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm text-gray-500 max-w-lg mt-2'>
          Our most loved essentials, consistently voted as wardrobe favorites by our community.
        </p>
      </div>

      {bestseller.length === 0 ? (
        <div className='text-center py-12 text-gray-400 text-sm'>
          Loading our bestseller pieces...
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8'>
          {bestseller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              images={item.images}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BestSeller
