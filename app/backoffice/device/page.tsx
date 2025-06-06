"use client";

import { useState, useEffect } from "react";
import { apiConfig } from "@/app/apiConfig";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [serial, setSerial] = useState("");
  const [name, setName] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [remark, setRemark] = useState("");
  const [id, setId] = useState(0);

  interface Device {
    id: number;
    name: string;
    barcode: string;
    serial: string;
    expireDate: string;
    remark: string;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(apiConfig.apiUrl + "/api/device/list");
      setDevices(res.data.devices);
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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    const payload = {
      barcode: barcode,
      serial: serial,
      name: name,
      expireDate: new Date(expireDate),
      remark: remark,
    };

    if (payload.name == "") {
      Swal.fire({
        icon: "error",
        text: "กรุณากรอกชื่อวัสดุ อุปกรณ์",
      });
      return;
    }

    try {
      if (id == 0) {
        await axios.post(apiConfig.apiUrl + "/api/device/create", payload);
        Swal.fire({
          title: "เพิ่มข้อมูลสำเร็จ",
          icon: "success",
        });
      } else {
        await axios.put(apiConfig.apiUrl + "/api/device/update/" + id, payload);
        Swal.fire({
          title: "แก้ไขข้อมูลสำเร็จ",
          icon: "success",
        });
      }

      setShowModal(false);
      setBarcode("");
      setSerial("");
      setName("");
      setExpireDate("");
      setRemark("");
      setId(0);

      fetchData();
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

  const handleEdit = (item: Device) => {
    setBarcode(item.barcode);
    setSerial(item.serial);
    setName(item.name);
    setExpireDate(item.expireDate);
    setRemark(item.remark);
    setId(item.id);

    handleShowModal();
  };

  const handleDelete = async (id: number) => {
    try {
      const button = await apiConfig.confirmDialog();

      if (button.isConfirmed) {
        await axios.delete(apiConfig.apiUrl + "/api/device/remove/" + id);
        Swal.fire({
          title: "ลบข้อมูลสำเร็จ",
          icon: "success",
        });

        fetchData();
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
      <h1>ทะเบียนวัสดุ อุปกรณ์</h1>
      <div className="card-body">
        <button className="btn btn-primary" onClick={handleShowModal}>
          <i className="fa-solid fa-plus mr-2"></i>
          เพิ่มรายการ
        </button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ชื่อวัสดุ</th>
              <th>barcode</th>
              <th>serial</th>
              <th>วันหมดประกัน</th>
              <th>หมายเหตุ</th>
              <th style={{ width: "130px" }}></th>
            </tr>
          </thead>
          <tbody>
            {devices.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.barcode}</td>
                <td>{item.serial}</td>
                <td>
                  {item.expireDate
                    ? dayjs(item.expireDate).isValid()
                      ? dayjs(item.expireDate).format("DD/MM/YYYY")
                      : "ไม่มีข้อมูล"
                    : "ไม่มีข้อมูล"}
                </td>
                <td>{item.remark}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(item)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal title="เพิ่มรายการ" isOpen={showModal} onClose={handleCloseModal}>
        <div className="">ชื่อวัสดุ อุปกรณ์</div>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-3">barcode</div>
        <input
          type="text"
          className="form-control"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <div className="mt-3">serial</div>
        <input
          type="text"
          className="form-control"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
        />
        <div className="mt-3">วันหมดประกัน</div>
        <input
          type="date"
          className="form-control"
          value={expireDate}
          onChange={(e) => setExpireDate(e.target.value)}
        />
        <div className="mt-3">หมายเหตุ</div>
        <input
          type="text"
          className="form-control"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <button className="btn btn-primary mt-3" onClick={handleSave}>
          <i className="fa-solid fa-check mr-2"></i>
          บันทึก
        </button>
      </Modal>
    </div>
  );
}
