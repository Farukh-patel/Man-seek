import axios from "axios";
import React from "react";
import { useState } from "react";
import {useNavigate} from "react-router-dom"
function Login() {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  
  const handleOnchange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleOnsubmit = async (e) => {
    const navigate=useNavigate()
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/users/auth/login",formData,
        { withCredentials: true }
      );
      // alert(res.data.message);
      console.log(res);
      setformData("")
      navigate("/")
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="bg-zinc-700 h-screen w-full text-white flex justify-center items-center flex-col">
      <div className="w-full max-w-md bg-zinc-900 rounded-lg shadow-lg p-6">
        <h2 className="text-zinc-400 text-center text-lg mb-6">
          Welcome Back! 👋 Login to continue
        </h2>
        <form onSubmit={handleOnsubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="relative">
            <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              onChange={handleOnchange}
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
              onChange={handleOnchange}
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
            <a className="text-zinc-400" href="/signup">
              Don't have an account?{" "}
              <span className="text-blue-500 hover:underline">Signup</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
