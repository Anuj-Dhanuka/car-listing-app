import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

//Styles
import "./index.css";

//Route Constants
import { ROUTES } from "../../navigations/routeConstants.jsx";

//Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

//Utils
import { deleteCarFromFirestore } from "../../utils/apiUtils.js";

//Redux
import { deleteCar } from "../../redux/slices/carsSlice.js";

const CarDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cars = useSelector((state) => state.cars.cars);
  const car = cars.find((car) => car.id.toString() === id);
  const [mainImage, setMainImage] = useState(car.images[0]);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };  

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleEditCar = () => {
    navigate(`/${ROUTES.EDITCAR}/${id}`);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCarFromFirestore(id);
      dispatch(deleteCar(id));
      navigate("/");
    } catch (error) {
      console.error("Error deleting car:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="car-detail-page">
      <Navbar className="navbar" />
      <div className="content-container">
        <div className="card">
          <div className="image-section">
            <div className="main-image-container">
            <img src={mainImage} alt={car.title} className="main-image" />
            </div>
            <div className="thumbnail-gallery">
              {car.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${mainImage === image ? "active" : ""}`}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </div>
          <div className="details-section">
            <div className="details-header">
              <h1>{car.title}</h1>
              <div className="edit-buttons">
                <button className="edit-button" onClick={handleEditCar}>
                  <FaEdit className="button-icon" />
                  Edit
                </button>
                <button
                  className={`edit-button ${loading ? "loading" : ""}`}
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loader"></div>
                  ) : (
                    <FaTrash className="button-icon" />
                  )}
                  <span className="button-text">
                    {loading ? "Deleting..." : "Delete"}
                  </span>
                </button>
              </div>
            </div>
            <p className="description">{car.description}</p>
            <div className="car-details">
              <span className="car-tag">Type: {car.tags.car_type}</span>
              <span className="car-tag">Company: {car.tags.company}</span>
              <span className="car-tag">Dealer: {car.tags.dealer}</span>
              <span className="car-tag">Price: ₹{formatPrice(car.price)}</span> 
            </div>
          </div>
        </div>
      </div>
      <Footer className="footer" />
    </div>
  );
};

export default CarDetailPage;
