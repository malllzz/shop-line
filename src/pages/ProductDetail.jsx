import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { addToCart } from "../store/cartSlice";
import { updateProductStock } from "../store/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = !!localStorage.getItem("access_token");

  const reduxProduct = useSelector((state) =>
    state.products.items.find((p) => p.id === Number(id))
  );

  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.id === Number(id))
  );

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct({
          ...response.data,
          stock: reduxProduct ? reduxProduct.stock : 20,
        });
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, reduxProduct]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add product to cart");
      setTimeout(
        () => navigate("/login", { state: { from: `/products/${id}` } }),
        2500
      );
      return;
    }

    if (product) {
      const parsedQuantity = Number(quantity);
      const existingQuantityInCart = cartItem ? cartItem.quantity : 0;

      if (parsedQuantity + existingQuantityInCart > product.stock) {
        toast.warn(
          "Check your cart. The remaining available stock has been added to your cart"
        );
        return;
      }

      if (parsedQuantity > product.stock) {
        toast.warn("There is not enough stock for the quantity you selected");
        return;
      }

      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: parsedQuantity,
        })
      );

      toast.success("Product successfully added to cart!");
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to proceed with your purchase");
      setTimeout(
        () => navigate("/login", { state: { from: `/products/${id}` } }),
        2500
      );
      return;
    }

    if (product) {
      const parsedQuantity = Number(quantity);
      const existingQuantityInCart = cartItem ? cartItem.quantity : 0;

      if (parsedQuantity + existingQuantityInCart > product.stock) {
        toast.warn(
          "Check your cart. The remaining available stock has been added to your cart."
        );
        return;
      }

      if (parsedQuantity > product.stock) {
        toast.warn("There is not enough stock for the quantity you selected");
        return;
      }

      const result = await Swal.fire({
        title: `Are you sure`,
        text: `to buy ${parsedQuantity} pcs of ${product.title}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        toast.success(
          `You have successfully purchased ${parsedQuantity} pcs ${product.title}`
        );
        const updatedStock = product.stock - parsedQuantity;
        dispatch(
          updateProductStock({ id: product.id, quantity: parsedQuantity })
        );
        setTimeout(() => navigate("/"), 2500);
      } else {
        toast.info("Purchase canceled");
      }
    }
  };

  const isOutOfStock = product && product.stock === 0;

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid"
            style={{
              maxWidth: "80%",
              maxHeight: "400px",
              objectFit: "contain",
            }}
          />
        </div>
        <div className="col-md-6">
          <h3>{product.title}</h3>
          <h5 className="fw-bold">
            Rp {product.price.toLocaleString("id-ID")}
          </h5>
          <p className="text-muted">{product.category}</p>
          <p className="d-flex align-items-center text-warning">
            <i className="fas fa-star"></i>
            <span className="ms-2">
              {product.rating?.rate || 0} ({product.rating?.count || 0} ratings)
            </span>
          </p>
          <p className="text-muted fw-bold">Available stock: {product.stock}</p>
          <hr />
          <p style={{ textAlign: "justify" }}>{product.description}</p>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <div className="d-flex align-items-center">
              <input
                type="number"
                id="quantity"
                className="form-control me-2"
                min="1"
                max={product.stock - (cartItem ? cartItem.quantity : 0)}
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value < 1) {
                    setQuantity(1);
                  } else if (value > product.stock) {
                    toast.warn("Quantity exceeds available stock!");
                    setQuantity(product.stock);
                  } else {
                    setQuantity(value);
                  }
                }}
                style={{ width: "80px" }}
              />
              <button
                onClick={handleBuyNow}
                className="btn btn-outline-primary me-2"
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Sold Out" : "Buy Now"}
              </button>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Sold Out" : "Add To Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;