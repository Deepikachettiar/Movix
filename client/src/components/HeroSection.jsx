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
    backgroundImage: 'url("https://image.tmdb.org/t/p/original/s4o9bK9qDrKXXWp9dJiDe.jpg")',
  }}
>

        <span className="text-primary font-bold text-sm tracking-widest mt-20">BIOGRAPHY</span>
    
        <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110'>
            Michael
        </h1>

        <div className='flex items-center gap-4 text-gray-300'>
            <span>Musical | Drama | History</span>
            <div className='flex items-center gap-1'>
                <CalendarIcon className='w-4.5 h-4.5'/>2026
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4.5 h-4.5'/> 2h 7m
            </div>
        </div>
        <p className="max-w-md text-gray-300">
        A comprehensive biographical portrait of Michael Jackson, tracing his journey from child stardom with the Jackson 5 to his status as the legendary King of Pop.
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