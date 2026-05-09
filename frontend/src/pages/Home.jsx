import Navbar from '@/components/layouts/Navbar'
import Footer from '@/components/layouts/Footer'
import React from 'react'


const Home = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar/>
       
       <main className="flex-1">

        {/* <Hero />
        <Categories />
        <RestaurantList />
        <Offers /> */}

      </main>

      <Footer/>
    </div>
  )
}

export default Home