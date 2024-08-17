import React, { useEffect, useState } from "react";
import { Link, matchPath } from "react-router-dom";
import { IoCartOutline } from "react-icons/io5";
import LOGO from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { IoIosArrowDown } from "react-icons/io";
import  ProfileDropdown from "../core/auth/ProfileDropdown";

const subLinkData = [
  {
      title: "python",
      link:"/catalog/python"
  },
  {
      title: "web dev",
      link:"/catalog/web-development"
  },
];

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const [subLinks, setSubLinks] = useState([]);

  const fetchCatalog = async() => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      //console.log(result);
      setSubLinks(result.data.data);

    } catch (error) {
      console.log("couldn't fetch the category", error);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="h-14 flex justify-between items-center border-b-[1px] border-b-richblack-700">
      <div className="w-11/12 max-w-maxContent mx-auto text-white flex justify-between items-center ">
        <Link to={"/"}>
          <img
            src={LOGO}
            alt="Mainlogo"
            width={160}
            height={32}
            loading="lazy"
          />
        </Link>

        <nav>
          <ul className="flex gap-10 text-richblack-25">
            {NavbarLinks?.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="relative flex items-center gap-1 group">
                    <p>{link.title} </p>
                    <IoIosArrowDown />

                    <div className="invisible absolute left-[50%] top-[50%] flex flex-col
                    rounded-md bg-richblack-5 text-richblack-900 opacity-0 transition-all
                     duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] 
                     translate-x-[-50%]  translate-y-[50%]">
                       <div className='absolute left-[50%] top-0
                                translate-x-[80%]
                                translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                       </div>
                       {
                                    subLinkData.length ? (
                                      subLinkData.map( (subLink, index) => (
                                                <Link className="mx-3 p-2 border-b border-b-richblack-800" to={`${subLink.link}`} key={index}>
                                                    <p>{subLink.title}</p>
                                                </Link>
                                            ) )
                                    ) : (<div></div>)
                                }

                    </div>
                    

                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* login - signup - dashboard - logout */}
        <div className="flex gap-5 items-center">
          
          {user && user?.accountType !== "Instructor" && (
            <Link to={"/dashboard/cart"} className="relative">
              <IoCartOutline fontSize={24} />
              {totalItems && totalItems.length > 0 ? <span>{totalItems}</span>: " "}
            </Link>
          )}
          {token === null && (
            <Link to={"/login"}>
              <button className="border border-richblack-100 py-1 px-4 rounded-md">
                Login
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-100 py-1 px-4 rounded-md">
                Sign Up
              </button>
            </Link>
          )}

          {
                token !== null || user !== null ? (<ProfileDropdown/>): ""
          }
          {/* {<Link to={"/login"} >Logout</Link> }
        {<Link to={"/dashboard"} >Dashboard</Link> } */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
