import React from "react";
import Instructor from "../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
  return (
    <div className="mt-16 mb-32">
      <div className="flex flex-row gap-20 items-center ">

        {/* left Box */}
        <div className="w-[50%]">
          <img src={Instructor} alt={"instructorImage"} />
        </div>

        {/* right Box */}
        <div className="w-[50%] flex flex-col gap-10">
          <div className="w-[50%] text-4xl font-semibold ">
            Become an
            <HighlightText text={" Instructor"} />
          </div>
          <div className="font-medium text-[16px] w-[80%] text-richblack-300">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </div>
          <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex flex-row items-center gap-2">
                Start Learning Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
