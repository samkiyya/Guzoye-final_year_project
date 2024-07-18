import axios from 'axios';
export const fetchAutocompletePlaces = async (inputValue, setOptions) => {
  if (inputValue.length > 3) {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=${
        import.meta.env.VITE_API_KEY
      }`
    );
    setOptions(response.data.features);
  }
};
