import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getProperties = async () => {
  const response = await axios.get(`${API_BASE_URL}/properties`);
  return response.data;
};

const propertyService = {
  getProperties,
};

export default propertyService;

