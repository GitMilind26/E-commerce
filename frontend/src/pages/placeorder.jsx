import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { cartItems, products, currency, delivery_fee, getCartAmount, clearCart, backendUrl, token, user, addAddress } = useContext(ShopContext)
  const location = useLocation()
  const navigate = useNavigate()
  
  // Parse discount parameter from route state
  const discountPercent = location.state?.discountPercent || 0

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  })
  
  const [saveAddress, setSaveAddress] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill fields if user profile exists
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || ''
      }))
      
      // If user has saved addresses, prefill the default one
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find(addr => addr.isDefault) || user.addresses[0]
        setFormData(prev => ({
          ...prev,
          street: defaultAddr.street || '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          postalCode: defaultAddr.postalCode || '',
          country: defaultAddr.country || '',
          phone: defaultAddr.phone || prev.phone
        }))
      }
    }
  }, [user])

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Address selection from multiple saved addresses
  const handleSelectSavedAddress = (addr) => {
    setFormData(prev => ({
      ...prev,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || prev.phone
    }))
    toast.info('Address fields loaded from saved profile')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      toast.warning('Please login to complete checkout.')
      navigate('/login')
      return
    }

    // Verify cart has items
    const orderItems = []
    for (const key in cartItems) {
      const [productId, size, color] = key.split('_')
      const product = products.find(p => p._id === productId)
      if (product) {
        orderItems.push({
          product: productId,
          name: `${product.name} (${size}/${color})`,
          qty: cartItems[key],
          image: product.images?.[0] || product.image?.[0] || 'placeholder.png',
          price: product.price
        })
      }
    }

    if (orderItems.length === 0) {
      toast.warning('Your cart is empty.')
      return
    }

    try {
      setSubmitting(true)

      const subtotal = getCartAmount()
      const discount = Math.round((subtotal * discountPercent) / 100)
      const shippingPrice = subtotal > 0 ? delivery_fee : 0
      const itemsPrice = subtotal - discount
      const totalPrice = itemsPrice + shippingPrice

      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone
      }

      // If user wants to save this address to database profile
      if (saveAddress) {
        await addAddress({
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
          isDefault: user?.addresses?.length === 0
        })
      }

      // Submit order details to backend Order API
      const response = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice: 0,
          shippingPrice,
          totalPrice
        })
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Order placed successfully!')
        clearCart()
        // Navigate to the newly placed order tracking details page!
        navigate(`/track/${data.order._id}`)
      } else {
        toast.error(data.message || 'Error placing order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Network error placing order')
    } finally {
      setSubmitting(false)
    }
  }

  // Cost calculations
  const subtotal = getCartAmount()
  const discount = Math.round((subtotal * discountPercent) / 100)
  const shipping = subtotal > 0 ? delivery_fee : 0
  const grandTotal = subtotal - discount + shipping

  return (
    <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-12 pt-10 border-t border-gray-100 text-gray-800 animate-fade-in'>
      
      {/* Left side: Billing Address form */}
      <div className='flex-1 flex flex-col gap-6'>
        <div className='mb-2'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        {/* Saved Addresses shortcuts */}
        {user?.addresses && user.addresses.length > 0 && (
          <div className='bg-white border border-gray-100 p-4 rounded-3xl shadow-sm mb-2'>
            <h4 className='text-xs font-bold text-gray-800 uppercase tracking-wider mb-3'>Use Saved Address</h4>
            <div className='flex flex-col gap-2'>
              {user.addresses.map((addr, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectSavedAddress(addr)}
                  className='text-xs text-gray-500 hover:text-black border border-gray-150 p-2.5 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-black transition flex items-center justify-between font-medium'
                >
                  <p className='truncate flex-1 pr-4'>{addr.street}, {addr.city}, {addr.state} ({addr.postalCode})</p>
                  {addr.isDefault && <span className='bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md'>DEFAULT</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <input
            required
            type='text'
            name='firstName'
            value={formData.firstName}
            onChange={onChangeHandler}
            placeholder='First Name'
            className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
          />
          <input
            required
            type='text'
            name='lastName'
            value={formData.lastName}
            onChange={onChangeHandler}
            placeholder='Last Name'
            className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
          />
        </div>

        <input
          required
          type='email'
          name='email'
          value={formData.email}
          onChange={onChangeHandler}
          placeholder='Email Address'
          className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
        />

        <input
          required
          type='text'
          name='street'
          value={formData.street}
          onChange={onChangeHandler}
          placeholder='Street Address / Flat No'
          className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
        />

        <div className='grid grid-cols-2 gap-4'>
          <input
            required
            type='text'
            name='city'
            value={formData.city}
            onChange={onChangeHandler}
            placeholder='City'
            className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
          />
          <input
            required
            type='text'
            name='state'
            value={formData.state}
            onChange={onChangeHandler}
            placeholder='State'
            className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <input
            required
            type='text'
            name='postalCode'
            value={formData.postalCode}
            onChange={onChangeHandler}
            placeholder='Postal / ZIP Code'
            className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
          />
          <input
            required
            type='text'
            name='country'
            value={formData.country}
            onChange={onChangeHandler}
            placeholder='Country'
            className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
          />
        </div>

        <input
          required
          type='tel'
          name='phone'
          value={formData.phone}
          onChange={onChangeHandler}
          placeholder='Phone Number'
          className='border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition bg-white'
        />

        {/* Save Address Toggle */}
        {token && (
          <label className='flex items-center gap-3 cursor-pointer text-xs text-gray-500 font-bold px-1'>
            <input
              type='checkbox'
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className='w-4 h-4 accent-black'
            />
            Save this address to my profile
          </label>
        )}
      </div>

      {/* Right side: Payment Methods & Subtotal */}
      <div className='w-full lg:w-[420px] flex flex-col gap-8'>
        
        {/* Cart totals */}
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
        </div>

        {/* Payment Methods choices */}
        <div className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4'>
          <h3 className='font-bold text-gray-800 mb-2 tracking-wider uppercase text-xs border-b border-gray-100 pb-2'>Payment Method</h3>
          
          <div className='flex flex-col gap-3'>
            {/* Stripe Card Option */}
            <div 
              onClick={() => setPaymentMethod('Card')}
              className={`flex items-center gap-4 border rounded-2xl p-4 cursor-pointer hover:bg-gray-50 transition duration-300 ${
                paymentMethod === 'Card' ? 'border-black bg-black/5' : 'border-gray-250 bg-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === 'Card' ? 'border-black bg-black' : 'border-gray-300 bg-white'
              }`}>
                {paymentMethod === 'Card' && <div className='w-1.5 h-1.5 rounded-full bg-white' />}
              </div>
              <img src={assets.stripe_logo} className='h-5 w-auto object-contain' alt="Stripe" />
            </div>

            {/* UPI Option */}
            <div 
              onClick={() => setPaymentMethod('UPI')}
              className={`flex items-center gap-4 border rounded-2xl p-4 cursor-pointer hover:bg-gray-50 transition duration-300 ${
                paymentMethod === 'UPI' ? 'border-black bg-black/5' : 'border-gray-250 bg-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === 'UPI' ? 'border-black bg-black' : 'border-gray-300 bg-white'
              }`}>
                {paymentMethod === 'UPI' && <div className='w-1.5 h-1.5 rounded-full bg-white' />}
              </div>
              <img src={assets.razorpay_logo} className='h-5 w-auto object-contain' alt="Razorpay" />
            </div>

            {/* COD Option */}
            <div 
              onClick={() => setPaymentMethod('COD')}
              className={`flex items-center gap-4 border rounded-2xl p-4 cursor-pointer hover:bg-gray-50 transition duration-300 ${
                paymentMethod === 'COD' ? 'border-black bg-black/5' : 'border-gray-250 bg-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === 'COD' ? 'border-black bg-black' : 'border-gray-300 bg-white'
              }`}>
                {paymentMethod === 'COD' && <div className='w-1.5 h-1.5 rounded-full bg-white' />}
              </div>
              <span className='text-xs font-bold text-gray-700 tracking-wide uppercase'>Cash On Delivery (COD)</span>
            </div>
          </div>

          <button
            type='submit'
            disabled={submitting}
            className='w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-2xl shadow-md transition mt-4 disabled:bg-gray-400'
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>

      </div>

    </form>
  )
}

export default PlaceOrder
