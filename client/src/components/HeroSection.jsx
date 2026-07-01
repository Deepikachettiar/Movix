import { ClockIcon, CalendarIcon,ArrowRight } from 'lucide-react'
import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {

    const navigate= useNavigate();
  return (
    <div
  className='flex flex-col items-start justify-center gap-4 
  px-6 md:px-16 lg:px-36 py-20 bg-cover bg-center h-screen'
  style={{
    backgroundImage: 'url("https://image.tmdb.org/t/p/original/7zQj76rh65WgT97nu3474h0H7f0.jpg")',
  }}
>

        <span className="text-primary font-bold text-sm tracking-widest mt-20">KANTARA</span>
    
        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>
            Kantara
        </h1>

        <div className='flex items-center gap-4 text-gray-300'>
            <span>Action | Drama | Mystery</span>
            <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4.5 h-4.5'/>2022
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/> 2h 30m
            </div>
        </div>
        <p className="max-w-md text-gray-300">
        When greed paves the way for betrayal, scheming and rebellion, a young tribal reluctantly allies with the forest department to protect his village's ancestral legacy and restore balance.
         </p>

         <button onClick={()=>navigate('/movies')}
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary 
        hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
         >
          Explore Movies
        <ArrowRight className="w-5 h-5" />
          </button>
    </div>
  )
}

export default HeroSection