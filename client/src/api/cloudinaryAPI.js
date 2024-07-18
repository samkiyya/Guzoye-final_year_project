import axios from 'axios';

export const uploadImg = async (image) => {
  try {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'TravelLog');
    const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    console.log(response.data.secure_url);
    return response.data.secure_url;
  } catch (err) {
    console.error(err.message);
    return err;
  }
};
