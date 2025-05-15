import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  // Destructure for easier access
  const { identifier, password } = formData;

  // Handle input changes
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const onSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const result = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        formData
      );

      // Access token and userId correctly
      const token = result.data.token;
      const userId = result.data.id;
      const role = result.data.role;

      localStorage.setItem("user", userId);
      localStorage.setItem("token", token);
      localStorage.setItem("role",role);
      window.location.href='/dashboard',
      toast.success("Login was successfull")
    } catch (error) {
      toast.error(error)
      console.error("Login error:", error);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-blue-100 overflow-hidden">
      {/* Main content */}
      <div className="flex justify-center items-center w-full h-full px-4">
        <div className="w-full max-w-5xl bg-gray-100 rounded-lg shadow-lg flex flex-col lg:flex-row overflow-hidden">
          {/* Left panel */}
          <div className="bg-blue-800 w-full lg:w-[40%] p-6 flex flex-col justify-center items-center text-center gap-4">
            <h1 className="text-white text-2xl font-semibold">Welcome Back!</h1>
            <p className="text-white text-sm hidden sm:block">
              Don't have an account? Allow us to walk you through the process.
            </p>
            <a className="text-white bg-blue-500 py-2 px-4 rounded-xl hover:bg-blue-700 transition cursor-pointer" href="/register">
              Register
            </a>
          </div>

          {/* Right panel (login form) */}
          <div className="w-full lg:w-[60%] p-6 flex items-center justify-center">
            <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Email or Username"
                name="identifier"
                value={identifier}
                onChange={onChange}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                className="p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
