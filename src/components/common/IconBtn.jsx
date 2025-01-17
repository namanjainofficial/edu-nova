// import React from "react";


// const IconBtn = (
//   text,
//   onClick,
//   children,
//   disabled,
//   outLine = false,
//   customClasses,
//   type
// ) => {
//   return (
//     <button
//     disabled ={disabled}
//     onClick={onClick}
//     type={type}
//     >
//         {
//             children ? (
//                 <>
//                  <span>{text}</span>
//                  {children}
//                 </>
               
//             ) : (
//                 text
//             )
//         }
//     </button>
//   );
// };

// export default IconBtn;

export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      className={`flex items-center ${
        outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50"
      } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
      type={type}
    >
      {children ? (
        <>
          <span className={`${outline && "text-yellow-50"}`}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  )
}