import React from 'react'
import Logo1 from '../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../assets/TimeLineLogo/Logo4.svg'
import timeLineImage from '../../assets/Images/TimelineImage.png'

const timeline = [
    {
        logo: Logo1,
        heading: "Leadership",
        description: "Fully committed to the success company"
    },
    {
        logo: Logo2,
        heading: "Responsibility",
        description: "Students will always be our top priority"
    },
    {
        logo: Logo3,
        heading: "Flexibility",
        description: "The ability to switch is an important skills"
    },
    {
        logo: Logo4,
        heading: "Solve the problem",
        description: "Code your way to a solution"
    }
];
const TimelineSection = () => {
  return (
    <div className='flex justify-center'>
       <div className='w-11/12 max-w-maxContent flex flex-row justify-center my-12'>

            {/* leftpart */}
            <div className='w-[40%] flex flex-col gap-12'>
                    {
                        timeline.map( (element, index) =>{
                            return(
                                <div className='flex flex-row gap-6' key={index}>
                                    <div className='h-[50px] w-[50px] rounded-full bg-white flex justify-center items-center'>
                                        <img src={element.logo} alt='logo' />
                                    </div>
                                    <div className='flex flex-col justify-start'>
                                        <h4 className='font-semibold text-[18px]'>
                                            {element.heading}
                                        </h4>
                                        <p className='text-base'>
                                            {element.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    }
            </div>

            {/* right part */}
            <div className='w-[45%]  relative '>
                    <img className='object-cover h-fit shadow-white' 
                    src={timeLineImage} alt='timelineimage'/>

                    <div className='absolute bg-caribbeangreen-700 flex text-white uppercase py-7
                    left-[10%] bottom-[-10%]'>
                            <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-500 px-10'>
                                <p className='text-4xl font-bold'>10</p>
                                <p className='text-caribbeangreen-300 text-sm'>Years <br></br>Experiences</p>
                            </div>
                            <div className='flex flex-row gap-5 items-center px-10'>
                                <p className='text-4xl font-bold'>250</p>
                                <p className='text-caribbeangreen-300 text-sm'>Types of <br></br>Courses</p>
                            </div>
                    </div>
            </div>
       </div>
       
    </div>
  )
}

export default TimelineSection
