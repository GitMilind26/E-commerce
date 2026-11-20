import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

const Track = () => {
  const { orderId } = useParams()
  const { backendUrl, token, currency, getProductImage } = useContext(ShopContext)
  const navigate = useNavigate()

  const [inputOrderId, setInputOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [socket, setSocket] = useState(null)

  const fetchOrderDetails = async (id) => {
    if (!id) return
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setOrder(data.order)
      } else {
        toast.error(data.message || 'Order not found')
        setOrder(null)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Error loading order tracking details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId)
    }
  }, [orderId, token])

  // Establish WebSocket connection when we track an order
  useEffect(() => {
    if (!orderId || !backendUrl) return

    const newSocket = io(backendUrl)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to socket server')
      // Join the tracking room for this order
      newSocket.emit('joinOrderTrack', { orderId })
    })

    // Listen for live status changes
    newSocket.on('orderStatusUpdate', (updatedData) => {
      console.log('Socket update received:', updatedData)
      toast.info(`Order status updated to: ${updatedData.status}`)
      setOrder((prev) => {
        if (!prev) return null
        return {
          ...prev,
          status: updatedData.status,
          trackingUpdates: updatedData.trackingUpdates
        }
      })
    })

    return () => {
      newSocket.disconnect()
    }
  }, [orderId, backendUrl])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!inputOrderId.trim()) return
    navigate(`/track/${inputOrderId.trim()}`)
  }

  // Define checkout tracking milestones
  const steps = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']
  
  const getStepIndex = (status) => {
    return steps.indexOf(status)
  }

  const currentStepIndex = order ? getStepIndex(order.status) : -1

  return (
    <div className='max-w-4xl mx-auto px-4 py-12 text-gray-800 min-h-[60vh]'>
      <h2 className='prata-regular text-3xl mb-8 text-center'>Track Your Order</h2>

      {/* Manual lookup form */}
      <form onSubmit={handleSearchSubmit} className='max-w-md mx-auto mb-12 flex gap-2'>
        <input
          required
          type='text'
          value={inputOrderId}
          onChange={(e) => setInputOrderId(e.target.value)}
          placeholder='Enter Order ID (e.g. 64c39fa...)'
          className='flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition'
        />
        <button
          type='submit'
          className='bg-black hover:bg-gray-800 text-white text-sm font-medium px-6 py-3 rounded-xl transition'
        >
          Track
        </button>
      </form>

      {loading ? (
        <div className='flex justify-center items-center py-16'>
          <div className='w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin'></div>
        </div>
      ) : order ? (
        <div className='bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm'>
          {/* Order Header info */}
          <div className='flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-6 mb-8 gap-4'>
            <div>
              <p className='text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1'>Order ID</p>
              <p className='text-sm font-mono font-bold'>{order._id}</p>
            </div>
            <div>
              <p className='text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1'>Payment Method</p>
              <p className='text-sm font-medium'>{order.paymentMethod} ({order.isPaid ? 'Paid' : 'Unpaid'})</p>
            </div>
            <div>
              <p className='text-xs text-gray-400 font-semibold tracking-wider uppercase mb-1'>Total Amount</p>
              <p className='text-sm font-bold'>{currency}{order.totalPrice}</p>
            </div>
          </div>

          {/* Visual Tracking Progress Bar */}
          <div className='mb-12'>
            <div className='relative flex items-center justify-between'>
              {/* Progress Line Background */}
              <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-100 -z-10' />
              {/* Active Progress Line */}
              <div
                className='absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-black -z-10 transition-all duration-500'
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`
                }}
              />

              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex
                const isActive = idx === currentStepIndex

                return (
                  <div key={step} className='flex flex-col items-center relative'>
                    {/* Circle Indicator */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-all duration-300 ${
                        isCompleted
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 text-gray-300'
                      } ${isActive ? 'ring-4 ring-black/10 scale-110' : ''}`}
                    >
                      {isCompleted && (
                        <svg className='w-3 h-3 fill-current' viewBox='0 0 20 20'>
                          <path d='M0 11l2-2 5 5L18 3l2 2L7 18z' />
                        </svg>
                      )}
                    </div>
                    {/* Step label */}
                    <span
                      className={`absolute top-8 whitespace-nowrap text-[10px] md:text-xs font-semibold tracking-wider transition-all duration-300 ${
                        isCompleted ? 'text-black' : 'text-gray-400'
                      } ${isActive ? 'font-bold underline underline-offset-4' : ''}`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Lists */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-8 border-t border-gray-100'>
            {/* Order Items */}
            <div>
              <h3 className='font-bold text-gray-800 mb-4 tracking-wide uppercase text-xs'>Items Ordered</h3>
              <div className='flex flex-col gap-4'>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className='flex gap-4 items-center border-b border-gray-50 pb-3 last:border-0'>
                    <img
                      src={getProductImage({ images: [item.image] })}
                      alt={item.name}
                      className='w-12 h-16 object-cover rounded-xl bg-gray-50'
                    />
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-semibold truncate'>{item.name}</h4>
                      <p className='text-xs text-gray-400'>Qty: {item.qty} &bull; Price: {currency}{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address & activity log */}
            <div className='flex flex-col gap-6'>
              <div>
                <h3 className='font-bold text-gray-800 mb-2 tracking-wide uppercase text-xs'>Shipping Address</h3>
                <p className='text-sm text-gray-500 leading-relaxed'>
                  {order.shippingAddress.street}, <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, <br />
                  {order.shippingAddress.country}
                </p>
                {order.shippingAddress.phone && (
                  <p className='text-xs text-gray-400 font-bold mt-2 tracking-wide uppercase'>
                    Phone: <span className='font-mono text-gray-600 normal-case'>{order.shippingAddress.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <h3 className='font-bold text-gray-800 mb-3 tracking-wide uppercase text-xs'>Tracking History</h3>
                <div className='flex flex-col gap-3 max-h-48 overflow-y-auto pr-2'>
                  {order.trackingUpdates?.slice().reverse().map((update, idx) => (
                    <div key={idx} className='flex items-start gap-3 border-l-2 border-black pl-3 pb-1'>
                      <div className='flex-1'>
                        <p className='text-xs font-bold text-gray-800'>{update.status}</p>
                        <p className='text-xs text-gray-500 leading-normal'>{update.description}</p>
                        <p className='text-[10px] text-gray-400 mt-0.5'>{new Date(update.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : orderId ? (
        <div className='text-center py-12 text-gray-500'>
          No tracking updates available for this Order ID. Please make sure the ID is correct.
        </div>
      ) : (
        <div className='text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 p-6'>
          Please enter an Order ID above to see the shipping status.
        </div>
      )}
    </div>
  )
}

export default Track
