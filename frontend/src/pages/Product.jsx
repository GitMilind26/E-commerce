import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'
import { toast } from 'react-toastify'

const Product = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { products, currency, getProductImage, addToCart, backendUrl, token } = useContext(ShopContext)

  const [productData, setProductData] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [loading, setLoading] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  
  // Reviews State
  const [reviews, setReviews] = useState([])
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  // Color Swatches list
  const colorsList = [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Gray', hex: '#8E8E93' },
    { name: 'Navy', hex: '#1A2B4C' },
    { name: 'Beige', hex: '#D2B48C' }
  ]

  const fetchProductDetails = async () => {
    // 1. First search in local product list (pre-fetched in context)
    const found = products.find(item => item._id === productId)
    if (found) {
      setProductData(found)
      const primaryImg = getProductImage(found, 0)
      setImage(primaryImg)
      
      // Default selections
      if (found.sizes && found.sizes.length > 0) {
        setSize(found.sizes[0])
      }
      setColor('Black')
      return
    }

    // 2. Fallback to API call if not in local list
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/api/products/${productId}`)
      const data = await response.json()
      if (data.success) {
        setProductData(data.product)
        const primaryImg = getProductImage(data.product, 0)
        setImage(primaryImg)
        if (data.product.sizes && data.product.sizes.length > 0) {
          setSize(data.product.sizes[0])
        }
        setColor('Black')
      }
    } catch (error) {
      console.error('Error loading product details:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch reviews for this product
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/products/${productId}/reviews`)
      const data = await response.json()
      if (data.success) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  // Submit new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.warning('Please login to write a product review.')
      navigate('/login')
      return
    }
    if (!reviewComment.trim()) {
      toast.warning('Please enter a review comment.')
      return
    }

    try {
      setSubmittingReview(true)
      const response = await fetch(`${backendUrl}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message || 'Review posted successfully!')
        setReviewComment('')
        setReviewRating(5)
        fetchReviews()
        fetchProductDetails() // Refresh ratings counts
      } else {
        toast.error(data.message || 'Could not submit review')
      }
    } catch (error) {
      console.error('Error posting review:', error)
      toast.error('Network error submitting review')
    } finally {
      setSubmittingReview(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
    fetchReviews()
  }, [productId, products])

  // Get Related products (by matching category)
  useEffect(() => {
    if (products.length > 0 && productData) {
      const related = products.filter(item => 
        item.category === productData.category && item._id !== productData._id
      )
      setRelatedProducts(related.slice(0, 4))
    }
  }, [products, productData])

  const handleBuyNow = () => {
    if (!size || !color) {
      toast.warning('Please select a size and color')
      return
    }
    addToCart(productData._id, size, color)
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center py-32'>
        <div className='w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className='text-center py-24 text-gray-500 font-semibold'>
        Product detail page not found.
      </div>
    )
  }

  // Resolve all images for thumbnail gallery
  const allProductImgs = []
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((_, idx) => {
      allProductImgs.push(getProductImage(productData, idx))
    })
  } else if (productData.image && productData.image.length > 0) {
    productData.image.forEach((_, idx) => {
      allProductImgs.push(getProductImage(productData, idx))
    })
  }

  return (
    <div className='border-t border-gray-100 pt-10 text-gray-800 animate-fade-in'>
      
      {/* Product Details Grid */}
      <div className='flex flex-col md:flex-row gap-12 mb-16'>
        
        {/* Left Side: Images Gallery */}
        <div className='flex-1 flex flex-col-reverse sm:flex-row gap-4'>
          {/* Thumbnails strip */}
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-start gap-3 sm:w-[18%] w-full max-h-[500px] scrollbar-hide'>
            {allProductImgs.map((img, idx) => (
              <img
                key={idx}
                onClick={() => setImage(img)}
                src={img}
                alt=""
                className={`w-[22%] sm:w-full aspect-[3/4] object-cover rounded-xl cursor-pointer bg-gray-50 border-2 transition ${
                  image === img ? 'border-black' : 'border-transparent hover:border-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Primary View Area */}
          <div className='w-full sm:w-[82%] bg-gray-50 rounded-3xl overflow-hidden aspect-[3/4] border border-gray-100 shadow-sm'>
            <img className='w-full h-full object-cover' src={image} alt={productData.name} />
          </div>
        </div>

        {/* Right Side: Purchasing Options */}
        <div className='flex-1 flex flex-col gap-6 justify-center'>
          
          <div>
            <h1 className='prata-regular text-3xl font-medium text-gray-900 mb-2'>{productData.name}</h1>
            
            {/* Reviews summary */}
            <div className='flex items-center gap-2 mt-1'>
              <div className='flex gap-0.5'>
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.round(productData.ratings || 0) ? assets.star_icon : assets.star_dull_icon}
                    alt=""
                    className='w-3.5'
                  />
                ))}
              </div>
              <span className='text-xs font-semibold text-gray-400'>
                ({productData.numOfReviews || 0} customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <p className='text-3xl font-bold text-gray-900'>{currency}{productData.price}</p>
          
          {/* Description */}
          <p className='text-sm text-gray-500 leading-relaxed font-medium'>{productData.description}</p>

          {/* Color swatches */}
          <div>
            <h3 className='font-bold text-gray-800 tracking-wider uppercase text-xs mb-3'>Select Color</h3>
            <div className='flex gap-3'>
              {colorsList.map(c => {
                const isSelected = color === c.name
                return (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full transition-all duration-300 relative ${
                      c.border ? 'border border-gray-300' : ''
                    } ${
                      isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'
                    }`}
                    title={c.name}
                  >
                    {isSelected && (
                      <span className={`absolute inset-0 flex items-center justify-center text-xs ${
                        c.name === 'White' || c.name === 'Beige' ? 'text-black' : 'text-white'
                      }`}>
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Size choices */}
          <div>
            <h3 className='font-bold text-gray-800 tracking-wider uppercase text-xs mb-3'>Select Size</h3>
            <div className='flex gap-3'>
              {productData.sizes?.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-12 h-12 rounded-xl border text-sm font-semibold tracking-wider transition ${
                    size === s
                      ? 'border-black bg-black text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex flex-col sm:flex-row gap-4 mt-4'>
            <button
              onClick={() => addToCart(productData._id, size, color)}
              className='flex-1 bg-white border-2 border-black text-black font-bold py-4 rounded-2xl shadow-sm hover:bg-gray-50 transition active:scale-95 duration-200'
            >
              Add To Cart
            </button>
            <button
              onClick={handleBuyNow}
              className='flex-1 bg-black text-white font-bold py-4 rounded-2xl shadow-md hover:bg-gray-800 transition active:scale-95 duration-200'
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>

      {/* Reviews Tab Layout */}
      <div className='border-t border-gray-200 pt-16 mb-16'>
        <h2 className='prata-regular text-2xl mb-8'>Customer Reviews</h2>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
          
          {/* Review List */}
          <div className='md:col-span-2 flex flex-col gap-6'>
            {reviews.length === 0 ? (
              <p className='text-sm text-gray-400 font-medium italic py-6'>No reviews yet for this product. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((rev, idx) => (
                <div key={idx} className='bg-white border border-gray-100 rounded-3xl p-5 shadow-sm'>
                  <div className='flex justify-between items-center mb-2'>
                    <div>
                      <p className='font-bold text-sm'>{rev.user?.name || rev.name}</p>
                      <div className='flex gap-0.5 mt-0.5'>
                        {[...Array(5)].map((_, i) => (
                          <img
                            key={i}
                            src={i < rev.rating ? assets.star_icon : assets.star_dull_icon}
                            alt=""
                            className='w-3'
                          />
                        ))}
                      </div>
                    </div>
                    <span className='text-[10px] text-gray-400'>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className='text-xs text-gray-500 leading-normal font-medium'>{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Post Review Form */}
          <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-fit'>
            <h3 className='font-bold text-gray-800 mb-4 tracking-wide uppercase text-xs'>Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className='flex flex-col gap-4 text-sm'>
              
              <div>
                <label className='block text-xs text-gray-400 font-semibold mb-2 uppercase'>Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className='w-full border border-gray-200 bg-white rounded-xl px-3 py-2.5 outline-none focus:border-black transition font-semibold'
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Poor)</option>
                  <option value="1">1 Star (Very Poor)</option>
                </select>
              </div>

              <div>
                <label className='block text-xs text-gray-400 font-semibold mb-2 uppercase'>Comment</label>
                <textarea
                  rows="4"
                  value={reviewComment}
                  required
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about product quality, fit, or materials..."
                  className='w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-black transition resize-none text-xs leading-normal'
                ></textarea>
              </div>

              <button
                type='submit'
                disabled={submittingReview}
                className='bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition text-xs shadow-md mt-2 disabled:bg-gray-400'
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className='my-24 border-t border-gray-100 pt-16'>
          <div className='text-center mb-10'>
            <Title text1={'RELATED'} text2={'PRODUCTS'} />
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {relatedProducts.map(item => (
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
        </div>
      )}

    </div>
  )
}

export default Product
