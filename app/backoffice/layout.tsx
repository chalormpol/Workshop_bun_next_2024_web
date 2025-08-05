"use client";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import TopNav from "../components/top-nav";
import Swal from "sweetalert2";

type JwtPayload = {
  exp: number;
};

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token_bun_service");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token); // ✅ ใช้ตรงนี้
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token_bun_service");
        localStorage.removeItem("bun_service_name");
        localStorage.removeItem("bun_service_level");
        router.push("/");
      }
    } catch (error: unknown) {
      // ✅ error จาก jwtDecode() จะเป็น SyntaxError หรือ Error ธรรมดา
      const msg = error instanceof Error ? error.message : String(error);
      Swal.fire({
        icon: "error",
        title: "Token ผิดพลาด",
        text: msg,
      });
      localStorage.removeItem("token_bun_service");
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="flex bg-gray-800">
        <Sidebar />
        <main className="flex-1 p-6 bg-gradient-to-t from-gray-600 to-gray-950 rounded-tl-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
