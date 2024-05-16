import React, { useState } from "react";
import axios from "axios";

const CreateTour: React.FC = () => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [reviews, setReviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("distance", distance);
    formData.append("desc", desc);
    formData.append("price", price.toString());
    formData.append("featured", featured.toString());
    formData.append("reviews", JSON.stringify(reviews));
    images.forEach((image, index) => {
      formData.append("images", image, image.name);
    });

    try {
      const response = await axios.post("/api/tours", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Tour created successfully!");
    } catch (error) {
      setMessage("Error creating tour");
      console.error("There was an error creating the tour!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Tour</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          required
        />
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Distance"
          required
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          required
        />
        <label>
          Featured:
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
        </label>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          Create Tour
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTour;
