import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
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

//Utils
import { db } from "../../utils/firebaseConfig.js";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeUserIdAndTokenInContext } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match!");
      return;
    }

    try {
      // Sign up user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const userId = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();

      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        userId,
        fullName: formData.fullName,
        email: formData.email,
        createdAt: new Date().toISOString(),
      });

      toast.success("User created successfully in Firebase!");

      storeUserIdAndTokenInContext(userId, token);

      dispatch(login({ userId, token, userName: formData.fullName }));

      toast.success("Successfully signed up!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = () => {
    navigate(`/${ROUTES.LOGIN}`);
  };

  return (
    <div className="signup-page">
      <div className="image-section">
        <img src={carImage} alt="Premium Car" className="car-image" />
      </div>
      <div className="form-section">
        <div className="signup-card">
          <h1 className="brand-name">SpyneCar</h1>
          <p className="signup-description">
            Join the future of driving with us!
          </p>
          <form className="signup-form" onSubmit={handleSignup}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                className="input-field"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
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
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
          <p className="login-redirect">
            Already have an account?
            <span className="login-link" onClick={handleLogin}>
              Log In
            </span>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignupPage;
