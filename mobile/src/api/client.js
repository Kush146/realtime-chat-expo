import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your server URL (if using a tunnel like ngrok, paste it here)
export const SERVER_URL = "https://fc341df3e206.ngrok-free.app";


const client = axios.create({ baseURL: SERVER_URL });


client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // required to bypass ngrok’s browser warning page
  config.headers['ngrok-skip-browser-warning'] = 'true';
  return config;
});
export default client;
