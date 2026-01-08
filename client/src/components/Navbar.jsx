import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu as MenuIcon, Search as SearchIcon, XIcon } from "lucide-react";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
  const { user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const { favoriteMovies } = useAppContext();
  
  const handleNavClick = () => {
    setIsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`px-4 py-2 rounded-full transition-colors
          ${isActive ? 'bg-primary text-white' : 'hover:text-primary'}`}
        onClick={handleNavClick}
      >
        {children}
      </Link>
    );
  };

  if (!isLoaded) return null;

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      <Link to='/' className='max-md:flex-1'>
        <img src={assets.mainlogo} alt="logo" className='w-40 h-auto'/>
      </Link>

      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
        max-md:text-lg z-50 flex flex-col md:flex-row items-center
        max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen
        min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10
        md:border border-gray-300/20 overflow-hidden transition-[width]
        duration-300 ${isOpen ? 'max-md:w-full':'max-md:w-0'}`}>

        <XIcon 
          className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' 
          onClick={() => setIsOpen(false)}
        />

        <NavLink to='/'>Home</NavLink>
        <NavLink to='/movies'>Movies</NavLink>
        {user && favoriteMovies.length>0 && <NavLink to='/favorites'>Favorites</NavLink>}
        {user && <NavLink to='/mybookings'>My Bookings</NavLink>}

      </div>

      <div className='flex items-center gap-8'>
        <SearchIcon className='w-6 h-6 mr-6 cursor-pointer text-white'/> 
        {!user ? (
          <button
            onClick={() => openSignIn()}
            className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-full font-medium transition cursor-pointer"
          >
            Login / Sign Up
          </button>
        ) : (
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonPopover: "bg-black/90 border border-white/10"
              }
            }}
          />
        )}
      </div>

      <MenuIcon 
        className="ml-4 md:hidden w-8 h-8 cursor-pointer text-white" 
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;