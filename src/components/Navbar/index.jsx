// Navbar Component (Navbar.jsx)
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

// Styles
import "./index.css";

// Route Constants
import { ROUTES } from "../../navigations/routeConstants.jsx";

// Context
import { useAuth } from "../../context/authContext.jsx";

//Redux
import { logout } from "../../redux/slices/authSlice.js";

const Navbar = () => {
  const { removeUserIdAndTokenFromContext } = useAuth();
  const dispatch = useDispatch();

  const handleLogout = () => {
    removeUserIdAndTokenFromContext();
    dispatch(logout());
  };

  return (
    <header className="nav-header">
      <h1 className="nav-logo">SpyneCar</h1>
      <nav className="nav-navbar">
        <Link to="/">My Cars</Link>
        <Link to={`/${ROUTES.ADDCAR}`}>Add Car</Link>
        <a
          href="https://671e6f2ad09a6000084a04d0--jolly-queijadas-6ba2d5.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Us
        </a>
        <button onClick={handleLogout} className="nav-logout">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
