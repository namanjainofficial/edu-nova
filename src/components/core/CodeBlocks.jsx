import React from 'react'
import CTAButton from './Button';
//import HighlightText from './HighlightText';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({
    position, heading, subHeading, ctabtn1, ctabtn2, backgroundGradient, codeblock, colorCode
}) => {
  return (
    <div className={`flex ${position} my-16 justify-between gap-10`}>
        
        {/* section1 */}
      <div className='w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold'>
                {subHeading}
            </div>
            <div className='flex gap-7 mt-7'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto} >
                    <div className='flex gap-2 items-center'>
                            {ctabtn1.btnText}
                            <FaArrowRight /> 
                    </div>
                </CTAButton>
                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto} >
                            {ctabtn2.btnText}
                </CTAButton>
            </div>
            
      </div>

      {/* Section2 */}
      <div className='h-hit flex flex-row text-[16px] w-[100%] lg:w-[500px]'>
        {/* Add Gradient backgroundGradient */}
        <div className='text-center flex flex-col w-[10%] text-rickblack-400 text-bold'>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
        </div>
        <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${colorCode} pr-2`}>
            <TypeAnimation 
                sequence={ [codeblock , 2000, ""]}
                repeat={Infinity}
                omitDeletionAnimation={true}
                cursor={true}
                style={
                    {
                        whiteSpace: "pre-line",
                        display: "block"
                    }
                }
                />
        </div>
      </div> 
      
    </div>
  )
}

export default CodeBlocks
