import { useState } from "react";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const AddTour = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    city: "",
    address: "",
    distance: 0,
    price: 0,
    maxGroupSize: 1,
    featured: false,
    photo: [],
  });
  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (e.target.type === "checkbox") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
  };

  const handleImageSubmit = () => {
    if (images.length > 0 && images.length + formData.photo.length < 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            photo: formData.photo.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 5 images per tour");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name.replace(/\s/g, "");
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadPercent(Math.floor(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      photo: formData.photo.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.photo.length === 0) {
      alert("You must upload at least 1 image");
      return;
    }
    if (
      formData.title === "" ||
      formData.desc === "" ||
      formData.city === "" ||
      formData.address === "" ||
      formData.distance <= 0 ||
      formData.price <= 0 ||
      formData.maxGroupSize <= 0
    ) {
      alert("All fields are required and must have valid values!");
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`${API_BASE_URL}/api/tour/create-tour`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
      }
      setLoading(false);
      setError(false);
      alert(data?.message);
      setFormData({
        title: "",
        desc: "",
        city: "",
        address: "",
        distance: 0,
        price: 0,
        maxGroupSize: 1,
        featured: false,
        photo: [],
      });
      setImages([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center p-3">
        <form
          onSubmit={handleSubmit}
          className="w-4/5 shadow-md rounded-xl p-3 gap-2 flex flex-col items-center"
        >
          <h1 className="text-center text-2xl font-semibold">Add Tour</h1>
          <div className="flex flex-col w-full">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="desc">Description:</label>
            <textarea
              type="text"
              className="border border-black rounded resize-none"
              id="desc"
              value={formData.desc}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              className="border border-black rounded"
              id="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="distance">Distance (km):</label>
            <input
              type="number"
              className="border border-black rounded"
              id="distance"
              value={formData.distance}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="price">Price ($):</label>
            <input
              type="number"
              className="border border-black rounded"
              id="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="maxGroupSize">Max Group Size:</label>
            <input
              type="number"
              className="border border-black rounded"
              id="maxGroupSize"
              value={formData.maxGroupSize}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2 w-full">
            <label htmlFor="featured">Featured:</label>
            <input
              type="checkbox"
              className="border border-black rounded w-4 h-4"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="photo">
              Images:
              <span className="text-red-700 text-sm">
                (images size should be less than 2mb and max 5 images)
              </span>
            </label>
            <input
              type="file"
              className="border border-black rounded"
              id="photo"
              multiple
              onChange={(e) => setImages(e.target.files)}
            />
          </div>
          {imageUploadError || error ? (
            <span className="text-red-600 w-full">
              {imageUploadError || error}
            </span>
          ) : null}
          <button
            hidden={images.length === 0}
            disabled={uploading || loading}
            className="bg-green-700 p-3 rounded text-white hover:opacity-95 disabled:opacity-80 w-full"
            type="button"
            onClick={handleImageSubmit}
          >
            {uploading
              ? `Uploading...(${imageUploadPercent}%)`
              : loading
              ? "Loading..."
              : "Upload Images"}
          </button>
          <button
            disabled={uploading || loading}
            className="bg-green-700 p-3 rounded text-white hover:opacity-95 disabled:opacity-80 w-full"
          >
            {uploading ? "Uploading..." : loading ? "Loading..." : "Add Tour"}
          </button>
          {formData.photo.length > 0 && (
            <div className="p-3 w-full flex flex-col justify-center">
              {formData.photo.map((image, i) => {
                return (
                  <div
                    key={i}
                    className="shadow-xl rounded-lg p-1 flex flex-wrap my-2 justify-between"
                  >
                    <img src={image} alt="" className="h-20 w-20 rounded" />
                    <button
                      onClick={() => handleDeleteImage(i)}
                      className="p-2 text-red-500 hover:cursor-pointer hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default AddTour;
