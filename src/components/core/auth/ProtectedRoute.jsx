// import React, { Children } from "react";
// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = () => {
//   const { token } = useSelector((state) => state.auth);
//   if (token !== null) return Children
//   else return <Navigate to="/login"/>
  
// };

// export default ProtectedRoute;
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {

    const {token} = useSelector((state) => state.auth);

    if(token !== null)
        return children
    else
        return <Navigate to="/login" />

}

export default ProtectedRoute

