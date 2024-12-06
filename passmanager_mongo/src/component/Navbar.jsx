import React from 'react'


const Navbar = () => {
  return (
   <nav className='bg-slate-800 text-white flex  justify-between items-centre  px-4  h-14 '>

    <div className="myContainer">
    <div className="logo font-bold ">
      <span className='text-green-700'>&lt;</span>
      Pass
      <span className='text-green-700'>OP /&gt;</span>
      </div>
    <ul>
      <li className='flex gap-4 '>  
        <a className='hover:font-bold' href="#">Home</a>
        <a className='hover:font-bold' href="#">Contact</a>
        <a className='hover:font-bold' href="#">service</a>
        <a className='hover:font-bold' href="#">about us</a>
        <a className='hover:font-bold' href="#">Home</a>
      </li>
    </ul>
    </div>
   </nav>
  )
};

export default Navbar