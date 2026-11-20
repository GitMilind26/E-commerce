import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const { login, register, token } = useContext(ShopContext)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  // If already logged in, redirect to home
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const validate = () => {
    const tempErrors = {}
    if (currentState === 'Sign Up' && !name.trim()) {
      tempErrors.name = 'Name is required'
    }
    if (!email) {
      tempErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email is invalid'
    }
    if (!password) {
      tempErrors.password = 'Password is required'
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    if (currentState === 'Login') {
      const success = await login(email, password)
      if (success) {
        navigate('/')
      }
    } else {
      const success = await register(name, email, password)
      if (success) {
        navigate('/')
      }
    }
  }

  const handleGoogleLogin = () => {
    toast.info('Google Sign-In is simulated. Generating a mock token...')
    // Simulating signup/login with Google
    setTimeout(async () => {
      const mockEmail = 'google_user@gmail.com'
      const mockName = 'Google Shopper'
      // Try to register/login with a fixed mock password behind the scenes
      const success = await login(mockEmail, 'googleOAuthPassword123!')
      if (!success) {
        // If they don't exist, register them
        const regSuccess = await register(mockName, mockEmail, 'googleOAuthPassword123!')
        if (regSuccess) {
          navigate('/')
        }
      } else {
        navigate('/')
      }
    }, 1000)
  }

  return (
    <div className='flex items-center justify-center min-h-[75vh] px-4'>
      <div className='w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6'>
        
        {/* Header */}
        <div className='text-center'>
          <h2 className='prata-regular text-3xl text-gray-800 mb-2'>{currentState}</h2>
          <p className='text-sm text-gray-400'>Enter your details to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          {currentState === 'Sign Up' && (
            <div className='flex flex-col gap-1'>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Full Name'
                className={`border rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition ${
                  errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.name && <span className='text-xs text-red-500 ml-1'>{errors.name}</span>}
            </div>
          )}

          <div className='flex flex-col gap-1'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email Address'
              className={`border rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition ${
                errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.email && <span className='text-xs text-red-500 ml-1'>{errors.email}</span>}
          </div>

          <div className='flex flex-col gap-1'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className={`border rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition ${
                errors.password ? 'border-red-400 focus:border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.password && <span className='text-xs text-red-500 ml-1'>{errors.password}</span>}
          </div>

          <button
            type='submit'
            className='bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300 text-sm mt-2'
          >
            {currentState === 'Login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className='flex justify-between items-center w-full text-xs text-gray-500 px-1'>
          {currentState === 'Login' ? (
            <p>
              New to our store?{' '}
              <span
                onClick={() => {
                  setCurrentState('Sign Up')
                  setErrors({})
                }}
                className='font-bold text-black underline cursor-pointer hover:text-gray-600 transition'
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => {
                  setCurrentState('Login')
                  setErrors({})
                }}
                className='font-bold text-black underline cursor-pointer hover:text-gray-600 transition'
              >
                Login
              </span>
            </p>
          )}
          {currentState === 'Login' && (
            <p className='cursor-pointer hover:text-black transition'>Forgot password?</p>
          )}
        </div>

        {/* Divider */}
        <div className='flex items-center w-full my-1'>
          <div className='flex-1 h-[1px] bg-gray-100' />
          <span className='px-3 text-xs text-gray-400 uppercase font-semibold tracking-wider'>Or</span>
          <div className='flex-1 h-[1px] bg-gray-100' />
        </div>

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleLogin}
          type='button'
          className='w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition duration-300 shadow-sm'
        >
          {/* Mock Google Logo using SVG */}
          <svg className='w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='#EA4335'
              d='M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.186 4.114-3.578 0-6.48-2.903-6.48-6.48s2.902-6.48 6.48-6.48c1.58 0 3.021.573 4.137 1.514L21.2 4.02C18.847 1.844 15.688 1 12.24 1 5.866 1 .7 6.166.7 12.54s5.166 11.54 11.54 11.54c6.26 0 11.54-5.28 11.54-11.54 0-.74-.067-1.454-.19-2.255H12.24z'
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default Login
