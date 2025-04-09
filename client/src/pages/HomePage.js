import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Welcome to StudySync 📚
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Coordinate your study groups effortlessly, connect with learners,
          collaborate in real time, and never miss a session again.
        </p>

        <div className="flex justify-center space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow"
          >
            Sign Up
          </button>
        </div>

        <div className="mt-8">
          <img
            src="https://cdn.dribbble.com/users/1904691/screenshots/16520238/media/eab0411f8c2b6a812e1cdd17f244dd2a.png"
            alt="Study Illustration"
            className="w-full max-h-80 object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
