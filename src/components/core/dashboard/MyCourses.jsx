import { useSelector } from "react-redux"
import IconBtn from "../../common/IconBtn"
import { useNavigate } from "react-router-dom"
import { VscAdd } from "react-icons/vsc"
import { useEffect, useState } from "react"
import CoursesTable from "./InstructorCourses/CoursesTable"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"

export default function MyCourses() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState('');
  const { token} = useSelector( (state) => state.auth);
  //const [loading, setLoading] = useState(false);

  useEffect(()=> {
    const fetchCourses = async() => {
      const result = await fetchInstructorCourses(token);
      if(result){
        setCourses(result);
      }
    }  
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      <div  className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn 
        text="Add Course"
        onclick={() => navigate('/dashboard/add-course')}
        >
           <VscAdd />
          </IconBtn>
      </div>
      { 
        courses && <CoursesTable courses={courses} setCourses={setCourses}/>
      }
    </div>
  )
}


