"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import apiConfig from "../apiConfig";
import Swal from "sweetalert2";

export default function Sidebar() {
  const [userLevel, setUserLevel] = useState("");

  const fetchUserLevel = useCallback(async () => {
    try {
      const token = localStorage.getItem(apiConfig.tokenKey);
      const response = await axios.get(`${apiConfig.apiUrl}/api/user/level`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserLevel(response.data);
    } catch (error) {
      handleAxiosError(error);
    }
  }, []);

  useEffect(() => {
    fetchUserLevel();
  }, [fetchUserLevel]);

  const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;

      // เช็คสถานะ 401 แบบละเอียด
      if (status === 401) {
        if (msg === "Unauthorized") {
          Swal.fire({
            icon: "warning",
            title: "ยังไม่ได้เข้าสู่ระบบ",
            text: "กรุณาเข้าสู่ระบบก่อนใช้งาน",
          });
        } else if (msg === "Invalid token") {
          Swal.fire({
            icon: "error",
            title: "Token ไม่ถูกต้องหรือหมดอายุ",
            text: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "ไม่ได้รับอนุญาต",
            text: `Status: ${status} - ${msg}`,
          });
        }
      } else {
        // กรณี error อื่น ๆ
        Swal.fire({
          icon: "error",
          title: "มีข้อผิดพลาด",
          text: `Status: ${status} - ${msg}`,
        });
      }
    } else {
      const msg = error instanceof Error ? error.message : String(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "ไม่ใช่ axios error: " + msg,
      });
    }
  };

  let menuItems: { title: string; href: string; icon: string }[] = [];

  if (userLevel === "admin") {
    menuItems = [
      {
        title: "Dashboard",
        href: "/backoffice/dashboard",
        icon: "fa-solid fa-chart-simple",
      },
      {
        title: "พนักงานร้าน",
        href: "/backoffice/user",
        icon: "fa-solid fa-users",
      },
      {
        title: "บันทึกการซ่อม",
        href: "/backoffice/repair-record",
        icon: "fa-solid fa-screwdriver-wrench",
      },
      {
        title: "สถานะการซ่อม",
        href: "/backoffice/repair-status",
        icon: "fa-solid fa-gear",
      },
      {
        title: "รายงานรายได้",
        href: "/backoffice/income-report",
        icon: "fa-solid fa-chart-line",
      },
      {
        title: "ทะเบียนวัสดุ อุปกรณ์",
        href: "/backoffice/device",
        icon: "fa-solid fa-box",
      },
      {
        title: "ข้อมูลร้าน",
        href: "/backoffice/company",
        icon: "fa-solid fa-building",
      },
    ];
  } else if (userLevel === "user") {
    menuItems = [
      {
        title: "บันทึกการซ่อม",
        href: "/backoffice/repair-record",
        icon: "fa-solid fa-screwdriver-wrench",
      },
    ];
  } else if (userLevel === "engineer") {
    menuItems = [
      {
        title: "สถานะการซ่อม",
        href: "/backoffice/repair-status",
        icon: "fa-solid fa-gear",
      },
    ];
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className="fa-solid fa-user text-4xl mr-5"></i>
        <h1 className="text-xl font-bold">Bun Service 2025</h1>
      </div>
      <nav className="sidebar-nav bg-gray-950 p-4 rounded-tl-3xl ml-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="sidebar-item">
                <i className={`${item.icon} mr-2`}></i>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
