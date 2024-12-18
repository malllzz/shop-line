import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import PrivateRoute from "./routes/PrivateRoute";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("access_token") !== null
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(token !== null);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              setSearchQuery={setSearchQuery}
            />
          }
        >
          <Route index element={<Home searchQuery={searchQuery} />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
