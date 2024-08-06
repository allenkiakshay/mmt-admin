"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.href = "/";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: btoa(email),
          password,
        }),
      });

      const data = await response.json();
      if (data.token) {
        // console.log(data.token);
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        alert(data.message || data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-white">
        <div className="hidden md:block md:w-1/2 h-screen relative">
          <Image src="/Login.png" alt="image" layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col justify-center items-start w-full md:w-1/2 bg-white p-4 md:ml-16">
          <h1 className="text-4xl font-bold text-black pt-5">Login Page</h1>
          <h6 className="text-sm text-gray-500 text-center pt-2">
            Mahesh Mens Touch
          </h6>
          <form
            className="flex flex-col w-full md:w-1/2 mt-9"
            onSubmit={handleLogin}
          >
            <p className="text-sm text-black">Email Address</p>
            <input
              type="email"
              value={email}
              placeholder="Email Address"
              className="border-2 rounded-[6px] p-2 border-black my-2 text-black"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-sm text-black">Password</p>
            <input
              type="password"
              value={password}
              placeholder="Password"
              className="border-2 rounded-md p-2 border-black my-2 text-black"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Placeholder for Google reCAPTCHA */}
            <div className="my-4">
              {/* Replace this with your reCAPTCHA implementation */}
              <div id="recaptcha-container"></div>
            </div>
            <button type="submit" className="bg-black text-white py-2 my-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
