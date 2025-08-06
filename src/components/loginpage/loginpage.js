import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaPhoneAlt, FaLock, FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateMobile = (number) => {
    const regex = /^[0-9]{10}$/; // Simple 10-digit validation
    return regex.test(number);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateMobile(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { mobile, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/students");
      }, 1500);
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid credentials";
        } else if (err.response.status === 404) {
          errorMessage = "Mobile number not registered";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="container max-w-6xl rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Content Section */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12 bg-white">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome Back</h1>
            <p className="text-gray-600 mb-8">
              Login to your account to access all features and connect with our community.
            </p>

            {/* Error Message */}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {/* Mobile Number Input */}
            <div className="mb-4">
              <label className="text-gray-700 font-medium mb-2 block">Mobile Number</label>
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-300 focus-within:border-blue-500">
                <FaPhoneAlt className="text-gray-500 mr-3" />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  className="bg-transparent focus:outline-none text-gray-800 w-full"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter 10 digits without country code</p>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="text-gray-700 font-medium mb-2 block">Password</label>
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-300 focus-within:border-blue-500">
                <FaLock className="text-gray-500 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  className="bg-transparent focus:outline-none text-gray-800 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 ml-2"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required</p>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-4">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : "Login"}
            </button>

            {/* Signup Link */}
            <p className="text-center text-gray-600 text-sm mt-5">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline font-semibold">
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {/* Right Side Image with Overlay Content */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-400 to-indigo-500 relative">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />

          <div className="relative z-10 h-full flex flex-col justify-center p-16 text-white bg-black/30">
            <h2 className="text-4xl font-bold mb-4">Portal Login</h2>
            <p className="text-lg mb-8 opacity-90 max-w-md">
              Manage your classes, track student progress, and connect with parents effortlessly.
            </p>

            {/* Testimonial */}
            <div className="flex items-center space-x-3 bg-white/20 p-4 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                <FaUser className="text-2xl text-white" />
              </div>
              <div>
                <p className="font-medium">
                  "Managing my classes has never been this simple!"
                </p>
                <p className="text-sm opacity-80">- Michael T., Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}