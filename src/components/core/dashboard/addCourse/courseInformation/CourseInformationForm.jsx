import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { useDispatch, useSelector } from "react-redux";
import RequirementField from "./RequirementField";
import { setStep, setCourse } from "../../../../../slices/coursesSlice";
import IconBtn from "../../../../common/IconBtn";
import {toast} from "react-hot-toast";
import { COURSE_STATUS } from '../../../../../utils/constant';
import { MdNavigateNext } from "react-icons/md";
import Upload from "../Upload";
import ChipInput from "./ChipInput";

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);
  const { course, editCourse } = useSelector((state) => state.course);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };

    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString()
    )
      return true;
    else 
    return false;
  };

  //   next button
  const onSubmit = async (data) => {

    
    //course Edit code
    if(editCourse) {
        if(isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId", course._id);
        if(currentValues.courseTitle !== course.courseName) {
            formData.append("courseName", data.courseTitle);
        }

        if(currentValues.courseShortDesc !== course.courseDescription) {
            formData.append("courseDescription", data.courseShortDesc);
        }

        if(currentValues.coursePrice !== course.price) {
            formData.append("price", data.coursePrice);
        }

        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }

        if(currentValues.courseBenefits !== course.whatYouWillLearn) {
            formData.append("whatYouWillLearn", data.courseBenefits);
        }

        if(currentValues.courseCategory._id !== course.category._id) {
            formData.append("category", data.courseCategory);
        }

        if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
            formData.append("instructions", JSON.stringify(data.courseRequirements));
        }

        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if(result) {
            setStep(2);
            dispatch(setCourse(result));
            
        }
        } 
        else {
            toast.error("NO Changes made so far");
        }
        
        return;
    }
    
    //create a new course
    let formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("thumbnailImage", data.courseImage)
    
    setLoading(true);
    console.log("BEFORE add course API call");
    console.log("PRINTING FORMDATA", formData);
    const result = await addCourseDetails(formData,token);
    if(result) {
        dispatch(setStep(2));
        dispatch(setCourse(result));
        
    }
    setLoading(false);
    console.log("step updated", step)
    console.log("PRINTING FORMDATA", formData);
    console.log("PRINTING result", result);
    
    
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8 font-semibold"
    >
      <div className="flex flex-col space-y-2">
        <label className="lable-style" htmlFor="courseTitle">
          Course Title<sup className="text-pink-200">*</sup>
        </label>
        <input
          type="text"
          id="courseTitle"
          placeholder="Enter the course Name"
          {...register("courseTitle", { required: true })}
          className="w-full form-style"
        />
        {errors.courseTitle && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is Required**</span>}
      </div>

      <div>
        <label className="lable-style" htmlFor="courseShortDesc">
          Description<sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && <span className="ml-2 text-xs tracking-wide text-pink-200"> Description is required**</span>}
      </div>

      <div className="relative">
        <label  className="lable-style" htmlFor="coursePrice">
          Price<sup className="text-pink-200">*</sup>
        </label>
        <input
          type="text"
          id="coursePrice"
          placeholder="Enter the Price"
          {...register("coursePrice", { required: true, 
            valueAsNumber: true,
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
            }, })}
          className="form-style w-full !pl-12"
        />
        <HiOutlineCurrencyRupee
          size={28}
          className="absolute top-1/2 text-richblack-800 "
        />
        {errors.coursePrice && <span className="ml-2 text-xs tracking-wide text-pink-200">Price is Required</span>}
      </div>

      <div>
        <label  className="lable-style" htmlFor="courseCategory">
          Course Category<sup className="text-pink-200">*</sup>
        </label>
        <select
          id="courseCategory"
          placeholder="Choose a category"
          default=" "
          {...register("courseCategory", { required: true })}
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose the Category
          </option>

          {!loading &&
            courseCategories?.map((category, index) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && 
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          Course Category is Required</span>}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      {/* file Upload */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      <div className="flex flex-col space-y-2">
        <label className="lable-style"  htmlFor="courseBenefits">
          Benefits<sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter the Course Benefits"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && 
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          Benefits is Required</span>}
      </div>

      <RequirementField
        name="courseRequirements"
        label="Requirement/Instruction"
        register={register}
        errors={errors}
        getValues={getValues}
        setValue={setValue}
      />

      <div className="flex justify-end gap-x-2">
        {
                editCourse && (
                    <button
                    onClick={() => dispatch(setStep(2))}
                    disabled={loading}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Continue Without Saving
                    </button>
                )
            }

            <IconBtn
                disabled={loading}
                text={!editCourse ? "Next" : "Save Changes"}>
                  <MdNavigateNext />
                </IconBtn>
            
      </div>
    </form>
  );
};

export default CourseInformationForm;
