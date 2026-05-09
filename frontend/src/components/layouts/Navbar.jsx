import React, { useState } from 'react'
import Logo from '../common/Logo'
import Location from '../common/Location'
import SearchBar from '../common/SearchBar'

const Navbar = () => {
  
  return (
    <>
    <div className='h-[13vh] w-full bg-primary-pale px-5 flex items-center gap-6'>
      <Logo/>
      <Location/>
      <SearchBar/>
      </div>
    </>
    
  )
}

export default Navbar