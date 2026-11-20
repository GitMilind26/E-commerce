import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const { getCartCount, token, logout, user } = useContext(ShopContext)
  const navigate = useNavigate()

  const handleSearchClick = () => {
    navigate('/collection')
  }

  return (
    <>
      <div className='sticky top-0 z-50 flex items-center justify-between px-6 py-4 font-medium bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl mt-3'>

        {/* Logo */}
        <Link to='/'>
          <img src={assets.logo} alt="Brand Logo" className='w-36' />
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden sm:flex text-gray-800 text-sm gap-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-md'>
          <NavLink className='hover:text-black hover:scale-105 transition-all duration-300' to='/'>
            <p>HOME</p>
          </NavLink>

          <NavLink className='hover:text-black hover:scale-105 transition-all duration-300' to='/collection'>
            <p>COLLECTION</p>
          </NavLink>

          <NavLink className='hover:text-black hover:scale-105 transition-all duration-300' to='/about'>
            <p>ABOUT</p>
          </NavLink>

          <NavLink className='hover:text-black hover:scale-105 transition-all duration-300' to='/contact'>
            <p>CONTACT</p>
          </NavLink>
        </ul>

        {/* Right Icons */}
        <div className='flex items-center gap-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md text-gray-800'>
          
          <img
            onClick={handleSearchClick}
            src={assets.search_icon}
            alt="Search Icon"
            className='w-5 cursor-pointer hover:scale-110 transition duration-300'
          />

          {/* Profile */}
          <div className='group relative py-2'>
            <img
              src={assets.profile_icon}
              alt="Profile Icon"
              className='w-5 cursor-pointer hover:scale-110 transition duration-300'
            />

            <div className='hidden group-hover:block absolute top-full right-0 z-50 pt-2'>
              <div className='w-40 p-4 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl'>
                <div className='flex flex-col gap-3 text-gray-800'>
                  {token ? (
                    <>
                      <p className='font-bold border-b border-gray-200/50 pb-2 truncate text-xs'>
                        Hi, {user?.name || 'User'}
                      </p>
                      <Link to='/orders' className='cursor-pointer hover:translate-x-1 transition-all text-xs'>
                        Orders
                      </Link>
                      <p onClick={logout} className='cursor-pointer hover:text-red-500 hover:translate-x-1 transition-all text-xs border-t border-gray-200/50 pt-2'>
                        Logout
                      </p>
                    </>
                  ) : (
                    <Link to='/login' className='cursor-pointer hover:translate-x-1 transition-all text-xs font-semibold'>
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cart */}
          <Link to='/cart' className='relative'>
            <img
              src={assets.cart_icon}
              alt="Cart Icon"
              className='w-5 min-w-5 cursor-pointer hover:scale-110 transition duration-300'
            />
            {getCartCount() > 0 && (
              <p className='absolute -bottom-1 -right-1 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md font-bold'>
                {getCartCount()}
              </p>
            )}
          </Link>

          {/* Mobile menu button */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="Mobile Menu"
            className='w-5 cursor-pointer sm:hidden hover:scale-110 transition duration-300'
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white/30 backdrop-blur-2xl border-l border-white/30 shadow-2xl z-[999] transition-all duration-300 overflow-hidden ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className='flex flex-col min-w-[250px] p-6 gap-5 text-black font-semibold'>
          <div
            onClick={() => setVisible(false)}
            className='flex items-center gap-3 cursor-pointer'
          >
            <img src={assets.dropdown_icon} alt="Back" className='h-4 rotate-180' />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setVisible(false)}
            className='py-3 px-4 rounded-xl bg-white/20 hover:bg-white/40 transition'
            to='/'
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className='py-3 px-4 rounded-xl bg-white/20 hover:bg-white/40 transition'
            to='/collection'
          >
            COLLECTION
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className='py-3 px-4 rounded-xl bg-white/20 hover:bg-white/40 transition'
            to='/about'
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className='py-3 px-4 rounded-xl bg-white/20 hover:bg-white/40 transition'
            to='/contact'
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Navbar