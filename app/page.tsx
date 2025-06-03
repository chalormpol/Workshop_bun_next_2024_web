"use client";

import Swal from "sweetalert2";
import { apiConfig } from "./apiConfig";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!username || !password) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Username and password are required",
        });
        return;
      }

      const payload = {
        username,
        password,
      };

      const response = await axios.post(
        `${apiConfig.apiUrl}/api/user/signin`,
        payload
      );

      if (response.data.token !== undefined) {
        localStorage.setItem(apiConfig.tokenKey, response.data.token);
        localStorage.setItem("bun_service_name", response.data.username);
        localStorage.setItem("bun_service_level", response.data.level);

        router.push("/backoffice/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid username or password",
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: msg,
        });
      } else {
        const msg = error instanceof Error ? error.message : String(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Not an axios error: " + msg,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-800 to-gray-950">
      <div className="text-gray-400 text-4xl font-bold mb-10">
        <i className="fa-solid fa-user-shield"></i>
        <span className="ml-2">Bun Service</span>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          <div className="text-center">เข้าสู่ระบบ</div>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 mt-10 w-full"
        >
          <div>
            <i className="fa-solid fa-user mr-2"></i>
            Username
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
          />
          <div className="mt-5">
            <i className="fa-solid fa-lock mr-2"></i>
            Password
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
          <button
            type="submit"
            className="btn bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors mt-5"
          >
            <i className="fa-solid fa-right-to-bracket mr-2"></i>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
