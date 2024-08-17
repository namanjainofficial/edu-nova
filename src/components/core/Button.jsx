import React from 'react'
import { Link } from 'react-router-dom'

const button = ({children , active, linkto}) => {
  return (
    <Link to={linkto}>
      
      <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold
        ${ active ? "bg-yellow-50" : "bg-richblack-800" } transition-all duration-200
        hover:scale-95`}>
            {children}
      </div>
    </Link>
  )
}

export default button
