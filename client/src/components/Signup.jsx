import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/auth/signup`,
        formData,
        { withCredentials: true }
      );
      console.log(res.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed");
      console.log(error.message);
    }
  };

  return (
    <div className="bg-zinc-700 h-screen w-full text-white flex justify-center items-center flex-col">
      <div className="w-full max-w-md bg-zinc-900 rounded-lg shadow-lg p-6">
        <h2 className="text-zinc-400 text-center text-lg mb-6">
          Welcome! 👋 Signup to continue
        </h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="relative">
            <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              onChange={handleOnChange}
              name="fullname"
              type="text"
              placeholder="Full name"
              className="pl-10 pr-4 py-2 w-full bg-zinc-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              onChange={handleOnChange}
              name="email"
              type="email"
              placeholder="Email address"
              className="pl-10 pr-4 py-2 w-full bg-zinc-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              onChange={handleOnChange}
              name="password"
              type="password"
              placeholder="Password"
              className="pl-10 pr-4 py-2 w-full bg-zinc-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
          </div>

          {/* Submit Button */}
          <input
            type="submit"
            value="Signup"
            className="bg-green-600 hover:bg-green-700 transition p-2 rounded-md cursor-pointer text-zinc-200 font-semibold"
          />

          {/* Link to Login */}
          <div className="text-center mt-2">
            <a className="text-zinc-400" href="/login">
              Already have an account?{" "}
              <span className="text-blue-500 hover:underline">Login</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
