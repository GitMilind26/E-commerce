import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, loading } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  
  // Filter States
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [maxPrice, setMaxPrice] = useState(400)
  const [sortType, setSortType] = useState('relevant')

  // Available options
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Gray', hex: '#8E8E93' },
    { name: 'Navy', hex: '#1A2B4C' },
    { name: 'Beige', hex: '#D2B48C' }
  ]

  const toggleCategory = (e) => {
    const value = e.target.value
    setCategory(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const toggleSubCategory = (e) => {
    const value = e.target.value
    setSubCategory(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
    )
  }

  const toggleColor = (colorName) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(item => item !== colorName) : [...prev, colorName]
    )
  }

  // Mock colors assigned to products for filter lookup
  const getProductColors = (product) => {
    const idLastChar = product._id ? product._id.slice(-1) : 'a'
    const charCode = idLastChar.charCodeAt(0)
    
    // Deterministic colors based on ID
    if (charCode % 5 === 0) return ['Black', 'White']
    if (charCode % 5 === 1) return ['Black', 'Gray']
    if (charCode % 5 === 2) return ['Navy', 'White']
    if (charCode % 5 === 3) return ['Beige', 'Black']
    return ['Gray', 'Navy', 'White']
  }

  // Apply filters
  const applyFilter = () => {
    let productsCopy = [...products]

    // Search filter
    if (search) {
      productsCopy = productsCopy.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }

    // Subcategory filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    // Sizes filter
    if (selectedSizes.length > 0) {
      productsCopy = productsCopy.filter(item => 
        item.sizes && item.sizes.some(size => selectedSizes.includes(size))
      )
    }

    // Colors filter
    if (selectedColors.length > 0) {
      productsCopy = productsCopy.filter(item => {
        const prodColors = getProductColors(item)
        return prodColors.some(c => selectedColors.includes(c))
      })
    }

    // Price range filter
    productsCopy = productsCopy.filter(item => item.price <= maxPrice)

    // Sort Products
    switch (sortType) {
      case 'low-high':
        productsCopy.sort((a, b) => a.price - b.price)
        break
      case 'high-low':
        productsCopy.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        // Fallback to sorting by date if exists, or name
        productsCopy.sort((a, b) => (b.date || 0) - (a.date || 0))
        break
      default:
        break
    }

    setFilterProducts(productsCopy)
  }

  useEffect(() => {
    applyFilter()
  }, [products, category, subCategory, selectedSizes, selectedColors, maxPrice, sortType, search])

  return (
    <div className='flex flex-col sm:flex-row gap-8 pt-10 border-t border-gray-100 text-gray-800'>
      
      {/* Filter Sidebar */}
      <div className='min-w-60 flex flex-col gap-6'>
        <p 
          onClick={() => setShowFilter(!showFilter)} 
          className='my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold'
        >
          FILTERS
          <img 
            className={`h-3 sm:hidden transition-transform duration-300 ${showFilter ? 'rotate-90' : ''}`} 
            src={assets.dropdown_icon} 
            alt="" 
          />
        </p>

        {/* Filter containers */}
        <div className={`flex flex-col gap-6 ${showFilter ? '' : 'hidden sm:flex'}`}>
          
          {/* Categories */}
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm'>
            <h3 className='font-bold text-gray-800 mb-4 tracking-wider uppercase text-xs'>Category</h3>
            <div className='flex flex-col gap-3 text-sm text-gray-600 font-medium'>
              <label className='flex gap-3 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-black' type="checkbox" value="Men" onChange={toggleCategory} />
                Men
              </label>
              <label className='flex gap-3 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-black' type="checkbox" value="Women" onChange={toggleCategory} />
                Women
              </label>
              <label className='flex gap-3 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-black' type="checkbox" value="Kids" onChange={toggleCategory} />
                Kids
              </label>
            </div>
          </div>

          {/* Subcategories */}
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm'>
            <h3 className='font-bold text-gray-800 mb-4 tracking-wider uppercase text-xs'>Type</h3>
            <div className='flex flex-col gap-3 text-sm text-gray-600 font-medium'>
              <label className='flex gap-3 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-black' type="checkbox" value="Topwear" onChange={toggleSubCategory} />
                Topwear
              </label>
              <label className='flex gap-3 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-black' type="checkbox" value="Bottomwear" onChange={toggleSubCategory} />
                Bottomwear
              </label>
              <label className='flex gap-3 items-center cursor-pointer hover:text-black'>
                <input className='w-4 h-4 accent-black' type="checkbox" value="Winterwear" onChange={toggleSubCategory} />
                Winterwear
              </label>
            </div>
          </div>

          {/* Sizes */}
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm'>
            <h3 className='font-bold text-gray-800 mb-4 tracking-wider uppercase text-xs'>Sizes</h3>
            <div className='flex flex-wrap gap-2'>
              {sizes.map(size => {
                const isSelected = selectedSizes.includes(size)
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Colors */}
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm'>
            <h3 className='font-bold text-gray-800 mb-4 tracking-wider uppercase text-xs'>Colors</h3>
            <div className='flex flex-wrap gap-3'>
              {colors.map(color => {
                const isSelected = selectedColors.includes(color.name)
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-6 h-6 rounded-full transition-all duration-300 relative ${
                      color.border ? 'border border-gray-300' : ''
                    } ${
                      isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    {isSelected && (
                      <span className={`absolute inset-0 flex items-center justify-center text-[10px] ${
                        color.name === 'White' || color.name === 'Beige' ? 'text-black' : 'text-white'
                      }`}>
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm'>
            <div className='flex justify-between items-center mb-3'>
              <h3 className='font-bold text-gray-800 tracking-wider uppercase text-xs'>Max Price</h3>
              <span className='text-xs font-bold bg-gray-50 border border-gray-100 px-2 py-1 rounded-md'>
                ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className='w-full accent-black cursor-pointer'
            />
            <div className='flex justify-between text-[10px] text-gray-400 font-bold mt-1'>
              <span>$50</span>
              <span>$400</span>
            </div>
          </div>

        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className='flex-1'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          
          {/* Sorting */}
          <select 
            onChange={(e) => setSortType(e.target.value)} 
            className='border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-black transition shadow-sm'
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Sort by: Newest</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className='flex justify-center items-center py-24'>
            <div className='w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin'></div>
          </div>
        ) : filterProducts.length === 0 ? (
          <div className='text-center py-24 text-gray-400 font-medium'>
            No clothing items found matching your filters. Try clearing some options.
          </div>
        ) : (
          /* Responsive Product Grid */
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 gap-y-8 animate-fade-in'>
            {filterProducts.map((item) => (
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

    </div>
  )
}

export default Collection
