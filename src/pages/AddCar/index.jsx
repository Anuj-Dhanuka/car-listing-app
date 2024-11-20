import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // Import uuid

// Styles
import "./index.css";

// Global Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Redux
import { addCar } from "../../redux/slices/carsSlice";

//Assets
import carImage from "../../assets/images/car-image1.png";

//Utils
import { addCarToFirestore } from "../../utils/apiUtils";

const AddCar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.auth);
  const { userId } = userDetails;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [carType, setCarType] = useState("");
  const [company, setCompany] = useState("");
  const [dealer, setDealer] = useState("");
  const [priceINR, setPriceINR] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event) => {
    setErrors("");
    const files = Array.from(event.target.files);

    const validImages = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // Max size 5MB
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

    setIsUploading(true);
    try {
      const uploadedImageUrls = [];
      for (const file of validImages) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "myCloud");
        data.append("cloud_name", "anuj-dhanuka");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/anuj-dhanuka/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const cloudData = await res.json();

        if (res.ok) {
          uploadedImageUrls.push(cloudData.url);
        } else {
          console.error("Image upload failed:", cloudData.error.message);
          toast.error(
            `Failed to upload ${file.name}: ${cloudData.error.message}`
          );
        }
      }

      setImages((prevImages) => {
        const combinedImages = [...prevImages, ...uploadedImageUrls];
        if (combinedImages.length > 10) {
          setErrors("You can upload a maximum of 10 images.");
          toast.error("You can upload a maximum of 10 images.");
          return prevImages;
        }
        return combinedImages;
      });

      toast.success(
        `${uploadedImageUrls.length} image(s) uploaded successfully!`
      );
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("An error occurred while uploading images.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    toast.info("Image removed successfully.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !carType ||
      !company ||
      !dealer ||
      !priceINR
    ) {
      toast.error("Please fill out all fields.");
      setErrors("");
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
      const newCar = {
        id: uuidv4(),
        userId: userId,
        title,
        description,
        images,
        price: priceINR,
        tags: { car_type: carType, company, dealer },
      };

      await addCarToFirestore(newCar);

      await dispatch(addCar(newCar));
      toast.success("Car added successfully!");
      navigate("/");
    } catch (error) {
      toast.error("An error occurred while adding the car. Please try again.");
      console.error("Error adding car:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-car-page">
      <Navbar />
      <div className="add-car-image-content-container">
        <div className="add-car-left-image-container">
          <div className="overlay">
            <img src={carImage} alt="Car" className="add-car-left-image" />
          </div>
        </div>
        <div className="add-car-container">
          <h2>Add Your Car</h2>
          <form onSubmit={handleSubmit} className="add-car-form">
            {/* Form Fields */}
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

            <label>Price in INR</label>
            <input
              type="number"
              value={priceINR}
              onChange={(e) => setPriceINR(e.target.value)}
              required
            />

            <label htmlFor="file-input">Upload Images (3 to 10)</label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />

            {isUploading && (
              <div className="uploading-loader">
                <span className="loader"></span>
                <p>Uploading...</p>
              </div>
            )}

            <div className="image-preview-container">
              {images.map((image, index) => (
                <div className="add-image-preview" key={index}>
                  <img
                    src={image}
                    alt={`preview-${index}`}
                    className="add-edit-image-small-images"
                  />

                  <span
                    className="remove-icon"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✖
                  </span>
                </div>
              ))}
            </div>

            {errors && <p className="error-message">{errors}</p>}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || isUploading} // Disable during submit or upload
            >
              Add Car
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddCar;
