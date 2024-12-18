import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../store/productSlice";
import { addToCart } from "../store/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  const cartItems = useSelector((state) => state.cart.items);
  const token = localStorage.getItem("access_token");

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      await dispatch(fetchProducts());
      setLoading(false);
    };

    if (products.length === 0) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [dispatch, products]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const handleAddToCart = (productId) => {
    if (!token) {
      toast.error("Please login to add product to cart", {
        position: "top-right",
      });
      setTimeout(() => navigate("/login"), 2500);
      return;
    }
  
    const product = products.find((p) => p.id === productId);
    if (!product) return;
  
    const existingItem = cartItems.find((item) => item.id === productId);
  
    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        toast.warn("Check your cart. The remaining available stock has been added to your cart", { position: "top-right" });
        return;
      }
    }
  
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    toast.success("Product successfully added to cart!", { position: "top-right" });
  };

  const formatCurrency = (value) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 className="text-center mb-4">Products</h2>
      {loading ? ( 
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;

              return (
                <div className="col-md-4 col-lg-3" key={product.id}>
                  <div className="card h-100 position-relative shadow-sm" style={{ borderRadius: "10px" }}>
                    <Link to={`/products/${product.id}`} className="card-img-top">
                      <div className="d-flex justify-content-center align-items-center">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="img-fluid"
                          style={{
                            maxHeight: "180px",
                            objectFit: "contain",
                            padding: " 10px",
                            width: "auto",
                          }}
                        />
                      </div>
                    </Link>
                    <div className="card-body d-flex flex-column">
                      <Link
                        to={`/products/${product.id}`}
                        className="card-title text-decoration-none"
                        style={{ fontSize: "1rem" }}
                      >
                        {product.title}
                      </Link>
                      <p className="card-text text-primary fw-bold">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="card-text text-muted">Stock: {product.stock}</p>
                      {product.rating && (
                        <div className="card-text d-flex align-items-center mb-3">
                          <i className="fas fa-star text-warning me-2"></i>
                          <span className="text-muted">
                            {product.rating.rate.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <div className="mt-auto d-flex justify-content-between">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="btn btn-sm btn-primary"
                          disabled={isOutOfStock}
                        >
                          {isOutOfStock ? "Sold Out" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center">
              {searchQuery
                ? `No products found for "${searchQuery}"`
                : "No products available at the moment."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;