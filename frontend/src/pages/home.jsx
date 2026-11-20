import React from 'react'
import Hero from '../components/hero'
import NewCollection from '../components/NewCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
  return (
    <div className='animate-fade-in'>
      <Hero />
      <NewCollection />
      <BestSeller />
      <OurPolicy />
    </div>
  )
}

export default Home
