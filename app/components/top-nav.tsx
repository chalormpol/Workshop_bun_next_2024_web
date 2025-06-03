"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { apiConfig } from "../apiConfig";

export default function TopNav() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const router = useRouter();

  useEffect(() => {
    setName(localStorage.getItem("bun_service_name") || "");
    setLevel(localStorage.getItem("bun_service_level") || "");
  }, []);

  const handleLogout = async () => {
    const button = await Swal.fire({
      title: "ออกจากระบบ",
      text: "คุณต้องการที่จะออกจากระบบหรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    if (button.isConfirmed) {
      localStorage.removeItem(apiConfig.tokenKey);
      localStorage.removeItem("bun_service_name");
      localStorage.removeItem("bun_service_level");
      router.push("/");
    }
  };

  const handleProfile = () => {
    router.push("/backoffice/profile");
  };

  return (
    <nav className="bg-gray-800 shadow-sm">
      <div className="mx-auto px-6">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">Bun Service 2025</h1>
          </div>
          <div className="flex items-center">
            <span className="text-gray-200">{name}</span>
            <span className="text-intego-400 ml-5 font-bold">( {level} )</span>

            <button
              onClick={handleProfile}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-5 hover:bg-indigo-600"
            >
              <i className="fa-solid fa-user mr-3"></i>
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-red-600"
            >
              <i className="fa-solid fa-right-from-bracket mr-3"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
