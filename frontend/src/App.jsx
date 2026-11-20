import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import Footer from './components/Footer'
import Home from './pages/home'
import Collection from './pages/collection'
import Contact from './pages/contact'
import About from './pages/about'
import Product from './pages/product'
import Cart from './pages/cart'
import Orders from './pages/orders'
import Login from './pages/login'
import PlaceOrder from './pages/placeorder'
import Track from './pages/track'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='min-h-screen flex flex-col justify-between bg-[#F9F9FB]'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
      
      <div className='relative px-4 sm:px-[5vw] md:px-[7vw] lg:px-[10vw] flex-1'>
        <Navbar />
        <SearchBar />
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/track/:orderId' element={<Track />} />
          <Route path='/track' element={<Track />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  )
}

export default App
