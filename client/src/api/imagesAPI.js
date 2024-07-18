import axios from 'axios';

export const fetchImages = async (place) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos?query=${place}&orientation=landscape&client_id=${
        import.meta.env.VITE_PHOTOS_API_KEY
      }`
    );
    const images = response.data.results;
    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const imageUrl = images[randomIndex].urls.regular;
      return imageUrl;
    } else {
      return response.data.results[1].urls.regular;
    }
  } catch (err) {
    console.log(err);
  }
};
