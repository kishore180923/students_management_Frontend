import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaVenusMars,
  FaExclamationCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // Handle mobile number input to allow only numbers
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
    if (value.length <= 10) { // Limit to 10 digits
      setFormData({ ...formData, mobile: value });
      if (errors.mobile) {
        setErrors({ ...errors, mobile: "" });
      }
    }
  };

  // ✅ Validate Form
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          gender,
          password: formData.password,
        }),
      });

      const data = await res.json();

      const toastStyle = {
        background: "#fff",
        color: "#red",
        fontSize: "16px",
        borderRadius: "12px",
        padding: "12px 20px",
        textAlign: "center",
      };

      if (res.ok) {
        toast.success("🎉 Account created successfully! Redirecting to login...", {
          position: "top-center",
          autoClose: 3000,
          style: toastStyle,
          transition: Bounce,
          icon: "🚀",
          onClose: () => navigate("/login"),
        });
      } else {
        if (data.message.toLowerCase().includes("email")) {
          setErrors({ ...errors, email: data.message });
          toast.error(" This email is already registered", {
            position: "top-center",
            style: toastStyle,
            transition: Bounce,
          });
        } else if (data.message.toLowerCase().includes("mobile")) {
          setErrors({ ...errors, mobile: data.message });
          toast.error(" This mobile number is already registered", {
            position: "top-center",
            style: toastStyle,
            transition: Bounce,
          });
        } else {
          toast.error(` ${data.message}`, {
            position: "top-center",
            style: toastStyle,
            transition: Bounce,
          });
        }
      }
    } catch (error) {
      toast.error(" An error occurred. Please try again.", {
        position: "top-center",
        style: {
          background: "#fff",
          color: "#fff",
          fontSize: "16px",
          borderRadius: "12px",
          padding: "12px 20px",
          textAlign: "center",
        },
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Left Side */}
          <div className="hidden md:block flex-1 bg-gradient-to-br from-gray-500 via-gray-700 to-black relative">
            <img
              src="stu.jpg"
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
            />
            <div className="relative z-10 h-full flex flex-col justify-center p-12 text-white">
              <h1 className="text-4xl font-bold mb-4">Registration</h1>
              <p className="text-xl mb-8 opacity-90">
                Connect with like-minded people and access exclusive content.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaUser className="text-2xl" />
                </div>
                <div>
                  <p className="font-medium">
                    "This platform helped me grow my network"
                  </p>
                  <p className="text-sm opacity-80">
                    - Michael T., Community Member
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 bg-white p-8 md:p-12">
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Create Your Account
              </h1>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 p-3 border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.firstName && (
                      <div className="absolute right-3 top-3 text-red-500">
                        <FaExclamationCircle />
                      </div>
                    )}
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 p-3 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.email && (
                      <div className="absolute right-3 top-3 text-red-500">
                        <FaExclamationCircle />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Mobile */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number* (10 digits)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Enter 10 digit mobile number"
                      value={formData.mobile}
                      onChange={handleMobileChange}
                      maxLength="10"
                      className={`w-full pl-10 p-3 border ${
                        errors.mobile ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.mobile && (
                      <div className="absolute right-3 top-3 text-red-500">
                        <FaExclamationCircle />
                      </div>
                    )}
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaVenusMars className="text-gray-400" />
                    </div>
                    <select
                      value={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                        if (errors.gender) {
                          setErrors({ ...errors, gender: "" });
                        }
                      }}
                      className={`w-full pl-10 p-3 border ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                    {errors.gender && (
                      <div className="absolute right-3 top-3 text-red-500">
                        <FaExclamationCircle />
                      </div>
                    )}
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                {/* Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password* (min 6 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && (
                      <div className="absolute right-10 top-3 text-red-500">
                        <FaExclamationCircle />
                      </div>
                    )}
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password*
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.confirmPassword && (
                      <div className="absolute right-10 top-3 text-red-500">
                        <FaExclamationCircle />
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    required
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 font-medium hover:underline">
                    Terms and Conditions*
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Already have account */}
              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}