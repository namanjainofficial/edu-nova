import React from 'react'
import HighlightText from './HighlightText'
import CTAButton from './Button'
import know_your_progress from '../../assets/Images/Know_your_progress.svg'
import compare_with_others from '../../assets/Images/Compare_with_others.svg'
import plan_your_lessons from '../../assets/Images/Plan_your_lessons.svg'

const LearningLanguageSection = () => {
  return (
    <div className='mt-[100px] flex flex-col justify-center items-center'>
        <div className='w-11/12 flex flex-col gap-5'>
            <div className='text-4xl font-semibold text-center'>
                Your swiss knife for 
                <HighlightText text={" learning any language"} /> 
            </div>
            <div className='w-[50%] font-semibold text-center text-black-600 mx-auto text-base'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>

        </div>
        {/* images */}
        <div className='w-11/12 flex flex-row justify-center items-center mt-5'>
                <img className='w-[30%] mr-[-100px] object-contain ' src={know_your_progress} alt=''/>
                <img className='w-[30%] object-contain' src={compare_with_others} alt=''/>
                <img className='w-[30%] ml-[-100px] object-contain' src={plan_your_lessons} alt=''/>
        </div>

        <div className='mt-5 mb-10'>
           <CTAButton active={true} linkto={"/signup"} >Learn More</CTAButton>
        </div>
    </div>
  )
}

export default LearningLanguageSection
