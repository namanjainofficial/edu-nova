import React, { useState } from 'react'
import CourseCard from './CourseCard';
import { HomePageExplore} from '../../data/homepage-explore'
import HighlightText from './HighlightText';
const tabNames = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]

const ExploreMore = () => {
    const [currentTab, setCurrentTab] =useState(tabNames[0]);
    const [courses, setCourse] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCard = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter( course => course.tag === value);
        setCourse(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }
  return (
    <div className='w-11/12 flex flex-col items-center'>
       <div className='text-4xl font-semibold'>
            Unlock the Power of Code
            <HighlightText text={" Power of Code"} />
       </div>
       <p className='text-richblack-300 text-[16px] font-semibold mt-3'>
       Learn to Build Anything You Can Imagine
       </p>
       {/* TAB */}
       <div className='flex gap-8 bg-richblack-800 rounded-full mt-5 mb-5 border-richblack-100 px-1 py-1'>
          { tabNames.map( (element, index) => {
            return(
                <div key={index} className={`text-[16px] flex flex-row gap-2 items-center
                    ${ currentTab === element ? "bg-richblack-900 text-pure-greys-100" :""}
                    rounded-full transition-all duration-200 cursor-pointer px-5 py-2 `}
                    onClick={() => setMyCard(element)}>
                    {element}
                </div>
            )
          })}
       </div>

       {/* Cards */}
       <div className='lg:h-[250px] '>

            <div className=' flex flex-row gap-10 justify-between w-full'>
                { courses.map( (element, index) => {
                    return(
                        <CourseCard 
                            key={index}
                            cardData={element}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                            />
                    )
                })}
            </div>

       </div>
    </div>
  )
}

export default ExploreMore
