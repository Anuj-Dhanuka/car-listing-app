import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

//Styles
import "./index.css";

//Route Constants
import { ROUTES } from "../../navigations/routeConstants.jsx";

//Global Components
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

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleEditCar = () => {
    navigate(`/${ROUTES.EDITCAR}/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteCarFromFirestore(id);

      dispatch(deleteCar(id));

      navigate("/");
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div className="car-detail-page">
      <Navbar />
      <div className="content-container">
        <div className="image-section">
          <div>
            <img src={mainImage} alt={car.title} className="main-image" />
          </div>
          <div className="thumbnail-gallery">
            {car.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${car.title} - ${index + 1}`}
                onClick={() => handleImageClick(image)}
                className={`thumbnail ${mainImage === image ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
        <div className="details-section">
          <div className="title-edit-container">
            <h1>{car.title}</h1>
            <div className="edit-button-container">
              <button className="edit-button" onClick={handleEditCar}>
                Edit Car
              </button>
              <button className="edit-button" onClick={handleDelete}>
                Delete Car
              </button>
            </div>
          </div>
          <p className="description">{car.description}</p>
          <div className="car-tags">
            <p>
              <strong>Type:</strong> {car.tags.car_type}
            </p>
            <p>
              <strong>Company:</strong> {car.tags.company}
            </p>
            <p>
              <strong>Dealer:</strong> {car.tags.dealer}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarDetailPage;
