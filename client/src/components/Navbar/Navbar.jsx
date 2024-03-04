import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from '../../context/authContext';
import { useContext } from "react";

const Navbar = () => {
  const { isStudent, setIsStudent } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    {
      title: "Home",
      link: "/"
    },
    {
      title: "Modules",
      link: "/previous-courses"
    },
    {
      title: "Input Modules",
      link: "/select-course"
    },
    {
      title: "Simulations",
      link: "/simulations"
    }
  ]

  return (
    <div className="cont">
      <div className="container">
        <div className="logo">
          <h1 style={{ fontFamily: "Benzin-Medium" }}>Sweat</h1>
        </div>
        <div className="links">
          <ul>
            {navItems?.map((item, index) => {
              if (isStudent === 'Student' && item?.title === 'Input Modules') {
                return <></>
              } else {
                return (<li key={index}>
                  <Link
                    to={item?.link}
                    className={location?.pathname === item?.link ? 'link-active' : 'link'}
                  >
                    {item?.title}
                  </Link>
                </li>)
              }
            }
            )}
            <select
              className="navDropDown"
              name="is_student"
              id="is_student"
              onChange={(e) => setIsStudent(e.target.value)}
            >
              <option>Student</option>
              <option>Admin</option>
            </select>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
