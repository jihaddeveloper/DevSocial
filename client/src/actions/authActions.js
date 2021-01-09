import axios from "axios";
import jwtDecode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from '../utils/setAuthToken';


// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
      .post("/api/user/register", userData)
      .then(res => history.push('/login'))
      .catch(err => 
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
        );
};

// Login User
export const loginUser = (userData, history) => dispatch => {
  axios
      .post("/api/user/login", userData)
      .then(res => {
        // Get jwt token
        const { token } = res.data;
        // Save toekn to Local Storage
        localStorage.setItem('jwtToken', token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get User data
        const decodedData = jwtDecode(token);
        // Set current user
        dispatch(setCurrentUser(decodedData));
      })
      .catch(err => 
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
        );
};

// Set current logged User
export const setCurrentUser = (decodedData) => {
  return{
    type: SET_CURRENT_USER,
    payload: decodedData
  }
}

// Log out User
export const logoutUser = () => dispatch =>{
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Set auth header to false
  setAuthToken(false);
  // Set current user to {} to set isAuthenticated to false
  dispatch(setCurrentUser({}));
}