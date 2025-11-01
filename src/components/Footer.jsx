import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            <footer className="flex flex-col items-center justify-around w-full py-16 text-sm bg-black text-gray-300">
                <img src={assets.mainlogo} alt="logo" />

                <p className="mt-4 text-center text-gray-400">
                    Copyright © 2025 <a href="https://prebuiltui.com" className="text-primary hover:text-indigo-300 transition-colors">MOVIX</a>. All rights reserved.
                </p>

                <div className="flex items-center gap-4 mt-6">
                    <a href="/" className="font-medium text-gray-300 hover:text-white transition-all">
                        Home
                    </a>
                    <div className="h-4 w-px bg-gray-500"></div>
                    <a href="/movies" className="font-medium text-gray-300 hover:text-white transition-all">
                        Movies
                    </a>
                </div>
            </footer>
        </>
    );
}

export default Footer