import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProductStock } from "../store/productSlice";
import { removeFromCart, updateCartQuantity, clearCart } from "../store/cartSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.products.items);

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
  }, [navigate]);

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  const handleQuantityChange = (id, newQuantity) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      if (newQuantity < 1) {
        dispatch(updateCartQuantity({ id, quantity: 1 }));
      } else if (newQuantity > product.stock) {
        toast.warn("Quantity exceeds available stock!");
        dispatch(updateCartQuantity({ id, quantity: product.stock }));
      } else {
        dispatch(updateCartQuantity({ id, quantity: newQuantity }));
      }
    }
  };

  const handleCheckout = () => {
    items.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product && item.quantity <= product.stock) {
        dispatch(updateProductStock({ id: item.id, quantity: item.quantity }));
        dispatch(removeFromCart(item.id));
      }
    });

    dispatch(clearCart());

    toast.success("Checkout successfully!");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mt-4">
        <ToastContainer position="top-right" autoClose={1500} />{" "}
        <h2>My Cart</h2>
        <p>You have not selected an item yet</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={1500} />{" "}
      <h2>My Cart</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th className="text-center">Product</th>
            <th className="text-center">Price</th>
            <th className="text-center">Quantity</th>
            <th className="text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const product = products.find((p) => p.id === item.id);
            if (!product) return null;

            return (
              <tr key={item.id}>
                <td className="d-flex align-items-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #ddd",
                      marginRight: "10px",
                      borderRadius: "4px",
                    }}
                  />
                  {item.title}
                </td>
                <td>Rp {parseFloat(item.price).toFixed(2).toLocaleString()}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="form-control"
                    style={{ width: "80px" }}
                    min="1"
                  />
                </td>
                <td>
                  Rp {(item.quantity * item.price).toFixed(2).toLocaleString()}
                </td>{" "}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end fw-bold">
              Total
            </td>
            <td>Rp {calculateTotal().toFixed(2).toLocaleString()}</td>{" "}
          </tr>
        </tfoot>
      </table>
      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Close
        </button>
        <button className="btn btn-primary" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;