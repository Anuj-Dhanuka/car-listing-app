import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Styles
import "./index.css";

//Route Constants
import { ROUTES } from "../../navigations/routeConstants.jsx";

//Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

//Utils
import { fetchUserCars } from "../../utils/apiUtils.js";

//Redux
import { setCars } from "../../redux/slices/carsSlice.js";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.auth);
  const { userId } = userDetails;
  const cars = useSelector((state) => state.cars.cars);
  const userCars = useMemo(() => {
    return cars.filter((car) => car.userId === userId);
}, [cars, userId]);

  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredCars, setFilteredCars] = useState(userCars);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };
  

  useEffect(() => {
    setLoading(true);
    const fetchCars = async () => {
      try {
        const userCars = await fetchUserCars(userId);
        dispatch(setCars(userCars));
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCars();
    }
  }, [userId, dispatch]);

  useEffect(() => {
    // Filter cars based on searchKeyword
    const filtered = userCars.filter(
      (car) =>
        car.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        car.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        Object.values(car.tags).some((tag) =>
          tag.toLowerCase().includes(searchKeyword.toLowerCase())
        )
    );
    setFilteredCars(filtered);
  }, [searchKeyword, userCars]);

  const handleCarDetailsClick = (id) => {
    navigate(`/${ROUTES.CARDETAIL}/${id}`);
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return `${description.substring(0, maxLength)}...`;
    }
    return description;
  };

  return (
    <div className="home-page">
      <Navbar />
      <section className="hero">
        <h2>Welcome to SpyneCar</h2>
        <p>Your one-stop solution to manage and showcase your cars</p>
        <button
          className="hero-button"
          onClick={() => navigate(`/${ROUTES.ADDCAR}`)}
        >
          Add Your Car
        </button>
      </section>

      <section className="search-bar">
        <input
          type="text"
          placeholder="Search cars by title, description, or tags..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={() => {}}>Search</button> {/* Optional button */}
      </section>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading your cars...</p>
        </div>
      ) : (
        <section className="car-listings">
          <h2>My Cars</h2>
          {filteredCars.length > 0 ? (
            <div className="car-grid">
              {filteredCars.map((car) => (
                <div className="car-card" key={car.id}>
                  <div className="image-container">
                    <img
                      src={car.images[0]}
                      alt={`${car.title}`}
                      className="home-car-image"
                    />
                  </div>
                  <h3>{car.title}</h3>
                  <p className="home-section-car-description">{truncateDescription(car.description, 100)}</p>
                  <div className="car-tags">
                    <span className="tag">Type: {car.tags.car_type}</span>
                    <span className="tag">Company: {car.tags.company}</span>
                    <span className="tag">Dealer: {car.tags.dealer}</span>
                  </div>
                  <p className="home-section-car-price">Price: {formatPrice(car.price) || "1,00,000"}</p>
                  <button
                    className="view-button"
                    onClick={() => handleCarDetailsClick(car.id)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-cars-container">
              <img
                src="/path/to/placeholder-image.png"
                alt="No cars illustration"
                className="no-cars-image"
              />
              <p className="no-cars-message">
                No cars match your search criteria. Try a different keyword!
              </p>
              <button
                className="add-car-button"
                onClick={() => navigate(`/${ROUTES.ADDCAR}`)}
              >
                Add Your Car
              </button>
            </div>
          )}
        </section>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
