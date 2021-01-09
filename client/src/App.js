import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import setAuthToken from './utils/setAuthToken';
import jwtDecode from 'jwt-decode';
import { loginUser, setCurrentUser } from './actions/authActions';
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import "./App.css";

// Check for loggedin User and token
if(localStorage.jwtToken) {
  
  // Set token to Auth header
  setAuthToken(localStorage.jwtToken);

  // Decode token to get User data
  const decodedData = jwtDecode(localStorage.jwtToken);
  
  // Set current user and isAuthenticated
  store.dispatch(setCurrentUser(decodedData));
  
  // Check for token expire
  const currentTime = Date.now() / 1000;
  if(decodedData.exp < currentTime){
    // Logout user
    store.dispatch(loginUser());

    // Clear current Profile
    // Todo
    
    // Redirect to login
    window.location.href = '/login';
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
