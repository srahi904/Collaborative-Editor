/** @format */

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../api/auth";
import { AuthContext } from "../contexts/AuthContext";

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const { login: doLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isLogin ? await login(formData) : await signup(formData);
      doLogin(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              name="username"
              placeholder="Username"
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={onChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Landing;
