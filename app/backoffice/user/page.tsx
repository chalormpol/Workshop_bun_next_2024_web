"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiConfig } from "@/app/apiConfig";
import Modal from "@/app/components/modal";
import Swal from "sweetalert2";

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const levels = ["admin", "user", "engineer"];
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [level, setLevel] = useState("admin");

  interface User {
    id: string;
    username: string;
    password: string;
    level: string;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get(`${apiConfig.apiUrl}/api/user/list`);
    setUsers(response.data.users);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      if (username == "") {
        Swal.fire({
          title: "กรุณาระบุชื่อผู้ใช้งาน",
          icon: "error",
        });
        return;
      }

      if (password !== confirmPassword) {
        Swal.fire({
          title: "รหัสผ่านทั้งสองช่องไม่ตรงกัน",
          icon: "error",
        });
        return;
      }

      const payload = {
        username: username,
        password: password,
        level: level,
      };

      if (id == "") {
        await axios.post(`${apiConfig.apiUrl}/api/user/create`, payload);
        Swal.fire({
          title: "เพิ่มข้อมูลสำเร็จ",
          icon: "success",
        });
      } else {
        await axios.put(
          `${apiConfig.apiUrl}/api/user/updateUser/${id}`,
          payload
        );
        Swal.fire({
          title: "แก้ไขข้อมูลสำเร็จ",
          icon: "success",
        });
        setId("");
      }

      fetchUsers();
      handleCloseModal();

      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setLevel("admin");
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

  const handleEdit = (user: User) => {
    setId(user.id);
    setUsername(user.username);
    setPassword("");
    setConfirmPassword("");
    setLevel(user.level);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const button = await apiConfig.confirmDialog();

      if (button.isConfirmed) {
        await axios.delete(`${apiConfig.apiUrl}/api/user/remove/${id}`);
        Swal.fire({
          title: "ลบข้อมูลสำเร็จ",
          icon: "success",
        });
        fetchUsers();
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
      <h1>พนักงานร้าน</h1>
      <div className="card-body">
        <button className="btn btn-primary" onClick={handleShowModal}>
          <i className="fa-solid fa-plus mr-2"></i>
          เพิ่มข้อมูล
        </button>
      </div>
      <table className="table table-striped mt-5">
        <thead>
          <tr>
            <th>ชื่อผู้ใช้งาน</th>
            <th style={{ width: "100px" }}>ระดับ</th>
            <th className="text-center" style={{ width: "220px" }}></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.level}</td>
              <td className="text-center">
                <button className="btn-edit" onClick={() => handleEdit(user)}>
                  <i className="fa-solid fa-edit"></i>
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(user.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        title="ข้อมูลพนักงานร้าน"
        isOpen={showModal}
        onClose={handleCloseModal}
      >
        <div className="">Username</div>
        <input
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="mt-5">Password</div>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mt-5">Confirm Password</div>
        <input
          type="password"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="mt-5">Level</div>
        <select
          className="form-control w-full"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <button className="btn btn-primary mt-5" onClick={handleSave}>
          <i className="fa-solid fa-check mr-2"></i>
          บันทึก
        </button>
      </Modal>
    </div>
  );
}
