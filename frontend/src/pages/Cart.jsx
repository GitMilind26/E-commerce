import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Cart = () => {
  const { cartItems, products, currency, delivery_fee, updateCartQty, removeFromCart, getCartAmount, getProductImage, token } = useContext(ShopContext)
  const navigate = useNavigate()
  
  // Promo code states
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (!promoCode.trim()) return
    
    if (promoCode.toUpperCase() === 'MINIMAL15' || promoCode.toUpperCase() === 'FIRST15') {
      setDiscountPercent(15)
      setCouponApplied(true)
      toast.success('15% Promo Code applied successfully!')
    } else {
      toast.error('Invalid or expired coupon code')
    }
  }

  const handleCheckout = () => {
    if (!token) {
      toast.warning('Please log in or register before checking out.')
      navigate('/login')
      return
    }
    navigate('/place-order', { state: { discountPercent } })
  }

  // Parse cart items into flat list
  const cartData = []
  for (const key in cartItems) {
    const [productId, size, color] = key.split('_')
    const product = products.find(p => p._id === productId)
    if (product) {
      cartData.push({
        key,
        productId,
        size,
        color,
        quantity: cartItems[key],
        product
      })
    }
  }

  const subtotal = getCartAmount()
  const discount = Math.round((subtotal * discountPercent) / 100)
  const shipping = subtotal > 0 ? delivery_fee : 0
  const grandTotal = subtotal - discount + shipping

  return (
    <div className='border-t border-gray-100 pt-10 text-gray-800 animate-fade-in'>
      <div className='mb-8'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className='text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center gap-6'>
          <p className='text-gray-400 font-semibold text-lg'>Your shopping cart is empty.</p>
          <Link
            to='/collection'
            className='bg-black hover:bg-gray-800 text-white text-sm font-semibold px-8 py-4 rounded-2xl transition shadow-md'
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className='flex flex-col lg:flex-row gap-12'>
          
          {/* Cart Item List */}
          <div className='flex-1 flex flex-col gap-6'>
            {cartData.map((item) => (
              <div
                key={item.key}
                className='flex items-center gap-4 bg-white border border-gray-100 p-4 md:p-6 rounded-3xl shadow-sm hover:shadow-md transition duration-300'
              >
                {/* Item Image */}
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.name}
                  className='w-16 h-20 md:w-20 md:h-26 object-cover rounded-2xl bg-gray-50'
                />
                
                {/* Item Details */}
                <div className='flex-1 min-w-0'>
                  <h3 className='font-bold text-sm md:text-base truncate'>{item.product.name}</h3>
                  <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 font-semibold mt-1'>
                    <span className='bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md'>Size: {item.size}</span>
                    <span className='bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md'>Color: {item.color}</span>
                  </div>
                  <p className='text-sm font-bold text-gray-900 mt-2'>{currency}{item.product.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className='flex items-center border border-gray-200 rounded-xl px-2 bg-white'>
                  <button
                    onClick={() => updateCartQty(item.key, item.quantity - 1)}
                    className='px-2 py-1.5 font-bold hover:text-black text-gray-400 text-sm'
                  >
                    -
                  </button>
                  <span className='px-3 text-xs font-bold text-gray-800'>{item.quantity}</span>
                  <button
                    onClick={() => updateCartQty(item.key, item.quantity + 1)}
                    className='px-2 py-1.5 font-bold hover:text-black text-gray-400 text-sm'
                  >
                    +
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => removeFromCart(item.key)}
                  className='p-2 hover:bg-red-50 rounded-xl transition duration-300 group'
                  title="Remove Item"
                >
                  <img src={assets.bin_icon} className='w-4 md:w-5 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition' alt="Delete" />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Sidebar: Calculations and Coupon codes */}
          <div className='w-full lg:w-[380px] flex flex-col gap-6'>
            
            {/* Promo Code box */}
            <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm'>
              <h3 className='font-bold text-gray-800 mb-4 tracking-wider uppercase text-xs'>Promo Code</h3>
              <form onSubmit={handleApplyPromo} className='flex gap-2'>
                <input
                  type='text'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code (MINIMAL15)"
                  disabled={couponApplied}
                  className='flex-1 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-black transition disabled:bg-gray-50'
                />
                <button
                  type='submit'
                  disabled={couponApplied}
                  className='bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-3 rounded-xl transition disabled:bg-gray-300'
                >
                  Apply
                </button>
              </form>
              {couponApplied && (
                <div className='flex justify-between items-center text-xs text-green-600 font-bold mt-3 bg-green-50/50 p-2 rounded-xl border border-green-100'>
                  <span>Code Applied (15% Off)</span>
                  <button 
                    onClick={() => { setCouponApplied(false); setDiscountPercent(0); setPromoCode(''); }}
                    className='underline hover:text-green-800'
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Calculations summaries */}
            <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 text-sm text-gray-600'>
              <h3 className='font-bold text-gray-800 mb-2 tracking-wider uppercase text-xs border-b border-gray-100 pb-2'>Order Summary</h3>
              
              <div className='flex justify-between font-semibold'>
                <span>Subtotal</span>
                <span>{currency}{subtotal}</span>
              </div>
              
              {discount > 0 && (
                <div className='flex justify-between text-green-600 font-bold'>
                  <span>Promo Code Discount</span>
                  <span>-{currency}{discount}</span>
                </div>
              )}

              <div className='flex justify-between font-semibold'>
                <span>Shipping Fee</span>
                <span>{currency}{shipping}</span>
              </div>

              <div className='h-[1px] bg-gray-100 my-2' />

              <div className='flex justify-between text-base font-bold text-gray-900'>
                <span>Total</span>
                <span>{currency}{grandTotal}</span>
              </div>

              <button
                onClick={handleCheckout}
                className='w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-2xl shadow-md transition mt-4'
              >
                Proceed To Checkout
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  )
}

export default Cart
