import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
  const { search, setSearch } = useContext(ShopContext)
  const [showSearch, setShowSearch] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Only show the search bar toggle on the collection page
    if (location.pathname.includes('collection')) {
      setShowSearch(true)
    } else {
      setShowSearch(false)
    }
  }, [location])

  if (!showSearch) return null

  return (
    <div className='border-t border-b border-gray-100 bg-gray-50/50 py-3 flex items-center justify-center transition-all duration-300'>
      <div className='inline-flex items-center justify-between border border-gray-300 px-5 py-2 rounded-full w-3/4 sm:w-1/2 bg-white shadow-sm hover:border-gray-400 transition-all'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 outline-none bg-inherit text-sm text-gray-700'
          type='text'
          placeholder='Search clothing, accessories, jackets...'
        />
        <img className='w-4 ml-3 opacity-60' src={assets.search_icon} alt='Search' />
      </div>
    </div>
  )
}

export default SearchBar
