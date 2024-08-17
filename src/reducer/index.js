import { combineReducers } from "@reduxjs/toolkit";
import authReducer from  '../slices/authSlice';
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
import coursesSlice from "../slices/coursesSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course: coursesSlice
});

export default rootReducer;