// Import necessary modules from react-router-dom
import { Routes, Route, Navigate } from "react-router-dom";

// Route Constants
import { ROUTES } from "./routeConstants.jsx";

// Pages
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import CarDetailPage from "../pages/CarDetailPage";
import AddCar from "../pages/AddCar";
import EditCar from "../pages/EditCar";

// Auth context
import { useAuth } from "../context/authContext";
import { useDispatch } from "react-redux";

//Redux
import { login } from "../redux/slices/authSlice.js";
import { fetchUserName } from "../utils/apiUtils.js";
import { useEffect } from "react";

const Navigations = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const getUserIdAndName = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId) {
      const userName = await fetchUserName(userId);

      dispatch(login({ userId, token, userName }));
    }
  };

  useEffect(() => {
    getUserIdAndName();
  }, []);

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<HomePage />} />
          <Route
            path={`/${ROUTES.CARDETAIL}/:id`}
            element={<CarDetailPage />}
          />
          <Route path={`/${ROUTES.ADDCAR}`} element={<AddCar />} />
          <Route path={`/${ROUTES.EDITCAR}/:id`} element={<EditCar />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path={`/${ROUTES.SIGNUP}`} element={<SignupPage />} />
          <Route path={`/${ROUTES.LOGIN}`} element={<LoginPage />} />
          <Route path="*" element={<Navigate to={`/${ROUTES.LOGIN}`} />} />
        </>
      )}
    </Routes>
  );
};

export default Navigations;
