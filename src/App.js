import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import OpenRoute from "./components/core/auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import MyProfile from "./components/core/dashboard/MyProfile";
import ProtectedRoute from "./components/core/auth/ProtectedRoute";
import Contact from "./pages/Contact";
import Settings from "./components/core/dashboard/settings/index";
import Error from "./pages/Error";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constant";
import Cart from "./components/core/dashboard/cart";
import EnrolledCourses from "./components/core/dashboard/EnrolledCourses";
import AddCourse from "./components/core/dashboard/addCourse";
import MyCourses from './components/core/dashboard/MyCourses';
import EditCourse from "./components/core/dashboard/editCourse";

function App() {

  const { user } = useSelector((state) => state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        ></Route>
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        ></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
                          
          }
        >
          <Route path="/dashboard/my-profile" element={<MyProfile />}></Route>
          <Route path="/dashboard/settings" element={<Settings />}></Route>

          {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }
      {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="/dashboard/add-course" element={<AddCourse />} />  
          <Route path="/dashboard/my-courses" element={<MyCourses />} />
          <Route path="/dashboard/edit-courses/:courseId" element={<EditCourse />} />
          </>
        )
      }
        </Route>

        <Route path="*" element={<Error />}></Route>
      </Routes>
    </div>
  );
}

export default App;
