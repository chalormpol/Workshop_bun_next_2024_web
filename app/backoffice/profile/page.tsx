"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { apiConfig } from "../../apiConfig";
import axios from "axios";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (username == "") {
      Swal.fire({
        title: "กรุณาระบุชื่อผู้ใช้งาน",
        icon: "error",
      });
      return;
    }

    if (password == "") {
      Swal.fire({
        title: "กรุณาระบุรหัสผ่าน",
        icon: "error",
      });
      return;
    }

    if (password == "") {
      Swal.fire({
        title: "กรุณาระบุรหัสผ่าน",
        icon: "error",
      });
      return;
    } else if (confirmPassword == "") {
      Swal.fire({
        title: "กรุณายืนยันรหัสผ่าน",
        icon: "error",
      });
      return;
    } else if (password !== confirmPassword) {
      Swal.fire({
        title: "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
        icon: "error",
      });
      return;
    }

    try {
      const payload = {
        username: username,
        password: password,
      };

      const headers = {
        Authorization: `Bearer ${localStorage.getItem(apiConfig.tokenKey)}`,
      };

      const response = await axios.put(
        apiConfig.apiUrl + "/api/user/update",
        payload,
        { headers: headers }
      );

      if (response.data.message == "success") {
        Swal.fire({
          title: "บันทึกข้อมูลสำเร็จ",
          icon: "success",
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
          title: "มีข้อผิดพลาด",
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
    <div className="card">
      <h1>Profile</h1>
      <div className="card-body">
        <div>Username</div>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="mt-5">Password (หากไม่ต้องการเปลี่ยนให้ละเว้น)</div>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mt-5">
          ยืนยัน Password ใหม่ (หากไม่ต้องการเปลี่ยนให้ละเว้น)
        </div>
        <input
          type="password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="btn btn-primary mt-5" onClick={handleSave}>
          <i className="fa-solid fa-check mr-3"></i> บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
}
