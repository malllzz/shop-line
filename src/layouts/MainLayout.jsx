import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function MainLayout({ isLoggedIn, setIsLoggedIn, setSearchQuery }) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("access_token");
      setIsLoggedIn(false);
      toast.success("You are successfully logged out");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    navigate("/");
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(token !== null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setIsLoggedIn]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <ToastContainer position="top-right" autoClose={2500} />{" "}
      <header className="d-flex justify-content-between align-items-center p-3 bg-light shadow-sm">
        <Link
          to="/"
          className="fs-4 fw-bold text-primary text-decoration-none m-0"
        >
          ShopLine
        </Link>

        <div className="d-none d-md-flex w-50">
          <form onSubmit={handleSearchSubmit} className="d-flex w-100">
            <input
              type="text"
              className="form-control"
              placeholder="Search products"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary ms-2">
              Search
            </button>
          </form>
        </div>

        <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link to="/" className="text-dark text-decoration-none">
            Home
          </Link>
          {!isLoggedIn && (
            <Link to="/login" className="text-dark text-decoration-none">
              Login
            </Link>
          )}
          {isLoggedIn && (
            <>
              <Link to="/cart" className="text-dark text-decoration-none">
                Cart
              </Link>
              <Link
                to="/"
                onClick={handleLogout}
                className="text-dark text-decoration-none"
              >
                Logout
              </Link>
            </>
          )}
        </nav>
      </header>

      <div className="d-md-none mb-3 p-3 bg-light">
        <form onSubmit={handleSearchSubmit} className="d-flex w-100">
          <input
            type="text"
            className="form-control"
            placeholder="Search products"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary ms-2">
            Search
          </button>
        </form>
      </div>
      <main className="container mt-1 flex-grow-1">
        <Outlet />
      </main>
      <footer className="py-3 bg-light text-center">
        <p className="text-muted m-0">© ShopLine 2024</p>
      </footer>
    </div>
  );
}

export default MainLayout;
