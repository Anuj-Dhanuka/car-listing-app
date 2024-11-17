import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";

//Styles
import "./index.css";

//Route Constants
import { ROUTES } from "../../navigations/routeConstants.jsx";

//Assets
import carImage from "../../assets/images/car-image2.png";

//Utils
import { auth } from "../../utils/firebaseConfig.js";

//Context
import { useAuth } from "../../context/authContext.jsx";

//Redux
import { login } from "../../redux/slices/authSlice.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {storeUserIdAndTokenInContext} = useAuth()

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSignup = () => {
    navigate(`/${ROUTES.SIGNUP}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Log in user with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const userId = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();

      // Store in Context
      storeUserIdAndTokenInContext(userId, token);

      // Store in Redux
      dispatch(login({ userId, token, userName: userCredential.user.email }));

      // Show success toast
      toast.success("Successfully logged in!");

      // Navigate to dashboard
      navigate(`/${ROUTES.DASHBOARD}`);
    } catch (err) {
      setError(err.message);
      toast.error(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="login-page">
      <div className="image-section">
        <img src={carImage} alt="Premium Car" className="car-image" />
      </div>
      <div className="form-section">
        <div className="login-card">
          <h1 className="brand-name">SpyneCar</h1>
          <p className="login-description">
            Join the future of driving with us!
          </p>
          <form className="login-form">
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="input-field"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-field"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button" onClick={handleLogin}>
              Log In
            </button>
          </form>
          <p className="signup-redirect">
            Don&apos;t have an account?
            <span className="signup-link" onClick={handleSignup}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
