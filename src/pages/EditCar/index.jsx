import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Styles
import "./index.css";

// Global Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Redux
import { updateCar } from "../../redux/slices/carsSlice";

//Assets
import carImage from "../../assets/images/car-image1.png";

//Utils
import { updateCarInFirestore } from "../../utils/apiUtils";

const EditCar = () => {
  const { id } = useParams();

  const cars = useSelector((state) => state.cars.cars);

  const car = cars.find((car) => car.id.toString() === id);
  console.log(car);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState(car?.title);
  const [description, setDescription] = useState(car.description);
  const [carType, setCarType] = useState(car.tags.car_type);
  const [company, setCompany] = useState(car.tags.company);
  const [dealer, setDealer] = useState(car.tags.dealer);
  const [images, setImages] = useState(car?.images || []);
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const validImages = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (validImages.length === 0) {
      toast.error(
        "No valid images found. Ensure files are images and under 5MB."
      );
      return;
    }

    if (validImages.length > 10) {
      toast.error("You can upload a maximum of 10 images.");
      return;
    }

    setImages((prevImages) => [
      ...prevImages,
      ...validImages.map((file) => URL.createObjectURL(file)),
    ]);
    toast.success(`${validImages.length} image(s) uploaded successfully!`);
  };

  const handleImageRemove = (imageToRemove) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.filter(
        (image) => image !== imageToRemove
      );

      if (typeof imageToRemove !== "string") {
        URL.revokeObjectURL(imageToRemove);
      }

      return updatedImages;
    });

    toast.info("Image removed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !carType || !company || !dealer) {
      toast.error("Please fill out all fields.");
      setErrors("Please fill out all fields.");
      return;
    }

    if (images.length < 3) {
      setErrors("Please upload at least 3 images.");
      toast.error("Please upload at least 3 images.");
      return;
    }

    setErrors("");
    setIsSubmitting(true);

    try {
      const updatedCar = {
        ...car,
        title,
        description,
        images, // Images already include valid URLs or ObjectURLs
        tags: { car_type: carType, company, dealer },
      };

      // Update car in Firebase
      await updateCarInFirestore(car.id, updatedCar);

      // Update car in Redux
      await dispatch(updateCar({ id: car.id, updatedCar }));

      toast.success("Car updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error(
        "An error occurred while updating the car. Please try again."
      );
      console.error("Error updating car:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-car-page">
      <Navbar />
      <div className="edit-car-image-content-container">
        <div className="edit-car-left-image-container">
          <div className="edit-overlay">
            <img src={carImage} alt="Car" className="edit-car-left-image" />
          </div>
        </div>
        <div className="edit-car-container">
          <h2>Edit Your Car</h2>
          <form onSubmit={handleSubmit} className="edit-car-form">
            <label>Car Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label>Car Type</label>
            <input
              type="text"
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              required
            />

            <label>Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <label>Dealer</label>
            <input
              type="text"
              value={dealer}
              onChange={(e) => setDealer(e.target.value)}
              required
            />

            <label>Upload Images (3 to 10)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />

            <div className="edit-image-preview-container">
              {images.length > 0 &&
                images.map((image, index) => (
                  <div className="edit-image-preview" key={index}>
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`preview-${index}`}
                      className="edit-image-small-images"
                    />
                    <button
                      type="button"
                      className="edit-image-remove-button"
                      onClick={() => handleImageRemove(image)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>

            {errors && <p className="edit-error-message">{errors}</p>}

            <button
              type="submit"
              className="edit-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Update Car"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditCar;
