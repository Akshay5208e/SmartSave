import PropTypes from "prop-types";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context/Materialindex";
import { logoutUser } from "@/features/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect, useState } from "react";


export function Sidenav({ brandImg, brandName, routes }) {

  const{user} = useGlobalContext();
  const [navigationRoutes, setnavigationRoutes] = useState([])
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const navigate = useNavigate();
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-blue-gray-800 to-blue-gray-900",
    white: "bg-white shadow-lg",
    transparent: "bg-transparent",
  };

  

 const signoutUser=()=>{
  dispatch(logoutUser());
  signOut(auth);
 
  setTimeout(window.location.reload(),2000)
 }

 
 


  return (
    <aside
    className={`${sidenavTypes[sidenavType]} ${
      openSidenav ? "translate-x-0" : "-translate-x-80"
    } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 flex flex-col`}
  >
    <div
      className={`relative border-b ${
        sidenavType === "dark" ? "border-white/20" : "border-blue-gray-50"
      }`}
    >
      <Link to="/" className="flex items-center gap-4 py-6 px-8">
        <Avatar src="/img/Rupees.png" size="sm" />
        <Typography
          variant="h6"
          color={sidenavType === "dark" ? "white" : "blue-gray"}
        >
          {brandName}
        </Typography>
      </Link>
      <IconButton
        variant="text"
        color="white"
        size="sm"
        ripple={false}
        className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
        onClick={() => setOpenSidenav(dispatch, false)}
      >
        <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
      </IconButton>
    </div>
    <div className="m-4">
      {[routes[0]].map(({ layout, title, pages }, key) => (
        <div key={key}>
          {title && (
            <Typography
              variant="small"
              color={sidenavType === "dark" ? "white" : "blue-gray"}
              className="font-black uppercase opacity-75 mx-3.5 mt-4 mb-2"
            >
              {title}
            </Typography>
          )}
          <ul className="flex flex-col gap-1">
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="px-4 pb-5 mt-auto">
      <Button  className="w-full" onClick={signoutUser}>SignOut</Button>
    </div>
  </aside>
  
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/Rupees.png",
  brandName: "Smart Save",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
