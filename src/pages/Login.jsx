import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const usersResponse = await fetch("https://fakestoreapi.com/users");
      const users = await usersResponse.json();

      const user = users.find((u) => u.email === email);

      if (user && user.password === password) {
        const response = await fetch("https://fakestoreapi.com/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("access_token", data.token);
          setIsLoggedIn(true);
          toast.success("You are successfully logged in!");

          const redirectTo = location.state?.from || "/";
          
          setTimeout(() => {
            navigate(redirectTo);
          }, 2000);
        } else {
          const errorText = await response.text();
          console.error("Login failed: ", errorText);
          setErrorMessage("Invalid username or password");
        }
      } else {
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <ToastContainer position="top-right" autoClose={1000} />
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px", borderRadius:"11px" }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <div className="mb-2">
            <p className ="m-0">Use</p>
            <p className="m-0">Email: morrison@gmail.com</p>
            <p className="m-0">Password: 83r5^_</p>
          </div>
          
          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;