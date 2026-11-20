import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Orders = () => {
  const { backendUrl, token, currency, getProductImage } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    if (!token) return
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders history')
    } finally {
      setLoading(false)
    }
  }

  // Simulate updating order status to the next stage to demonstrate live websockets
  const handleSimulateStatus = async (orderId, currentStatus) => {
    const statusCycle = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']
    const currentIndex = statusCycle.indexOf(currentStatus)
    if (currentIndex === -1 || currentIndex === statusCycle.length - 1) {
      toast.info('Order has already been delivered!')
      return
    }

    const nextStatus = statusCycle[currentIndex + 1]
    const descriptions = {
      Confirmed: 'Payment verified and order has been confirmed by merchant.',
      Shipped: 'Order packed and handed over to our shipping partner. Tracking ID generated.',
      'Out for Delivery': 'Your delivery agent has loaded your parcel and is on the way.',
      Delivered: 'Parcel handed over to customer. Thank you for shopping with us!'
    }

    try {
      const response = await fetch(`${backendUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: nextStatus,
          description: descriptions[nextStatus]
        })
      })
      const data = await response.json()
      if (data.success) {
        toast.success(`Simulation: Order updated to ${nextStatus}!`)
        fetchOrders() // refresh list
      } else {
        toast.error('Simulation update failed')
      }
    } catch (error) {
      console.error('Error in status simulation:', error)
      toast.error('Network error during status simulation')
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders()
    }
  }, [token])

  if (!token) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-20 text-center text-gray-800 min-h-[50vh]'>
        <p className='text-gray-400 font-semibold mb-6'>Please login to view your order history.</p>
        <Link to='/login' className='bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-2xl font-bold shadow-md transition'>
          Sign In / Register
        </Link>
      </div>
    )
  }

  return (
    <div className='max-w-5xl mx-auto px-4 pt-10 border-t border-gray-100 text-gray-800 min-h-[70vh] animate-fade-in'>
      <div className='mb-8'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {loading && orders.length === 0 ? (
        <div className='flex justify-center items-center py-20'>
          <div className='w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin'></div>
        </div>
      ) : orders.length === 0 ? (
        <div className='text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center gap-6'>
          <p className='text-gray-400 font-semibold'>You haven't placed any orders yet.</p>
          <Link to='/collection' className='bg-black hover:bg-gray-800 text-white text-xs font-semibold px-8 py-4 rounded-2xl transition shadow-md'>
            Go To Store Catalog
          </Link>
        </div>
      ) : (
        <div className='flex flex-col gap-6'>
          {orders.map((order) => (
            <div
              key={order._id}
              className='bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col gap-6'
            >
              {/* Order Header Summary */}
              <div className='flex flex-wrap justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-xs gap-3'>
                <div className='flex gap-6'>
                  <div>
                    <p className='text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Date Placed</p>
                    <p className='font-bold text-gray-700'>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Total</p>
                    <p className='font-bold text-gray-700'>{currency}{order.totalPrice}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 font-semibold uppercase tracking-wider mb-0.5'>Status</p>
                    <p className={`font-bold uppercase tracking-wider ${
                      order.status === 'Delivered' ? 'text-green-600' : 'text-orange-500'
                    }`}>{order.status}</p>
                  </div>
                </div>
                <div>
                  <p className='text-gray-400 font-semibold mb-0.5'>Order ID</p>
                  <p className='font-mono font-bold text-gray-700'>{order._id}</p>
                </div>
              </div>

              {/* Order items detail mapping */}
              <div className='flex flex-col gap-4'>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className='flex items-center gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0'>
                    <img
                      src={getProductImage({ images: [item.image] })}
                      alt={item.name}
                      className='w-12 h-16 object-cover rounded-xl bg-gray-50'
                    />
                    <div className='flex-1 min-w-0 text-sm'>
                      <h4 className='font-bold truncate'>{item.name}</h4>
                      <p className='text-xs text-gray-400 font-semibold mt-1'>
                        Quantity: {item.qty} &bull; Price: {currency}{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className='flex flex-wrap justify-between items-center mt-2 border-t border-gray-50 pt-4 gap-4'>
                {/* Simulator shortcut */}
                {order.status !== 'Delivered' && (
                  <button
                    onClick={() => handleSimulateStatus(order._id, order.status)}
                    className='text-[10px] text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 font-bold px-3 py-2 rounded-xl transition uppercase tracking-wider border border-gray-200'
                  >
                    Simulate Next Status ➜
                  </button>
                )}
                <div className='flex gap-3 ml-auto'>
                  <Link
                    to={`/track/${order._id}`}
                    className='bg-black hover:bg-gray-800 text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-md transition'
                  >
                    Track Status
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
