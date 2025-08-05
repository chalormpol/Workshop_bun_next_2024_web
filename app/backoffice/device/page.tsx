"use client";

import { useState, useEffect, useCallback } from "react";
import { apiConfig } from "@/app/apiConfig";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

interface Device {
  id: number;
  name: string;
  barcode: string;
  serial: string;
  expireDate: string;
  remark: string;
}

export default function Page() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [serial, setSerial] = useState("");
  const [name, setName] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [remark, setRemark] = useState("");
  const [id, setId] = useState(0);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalPageList, setTotalPageList] = useState<number[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const params = { page, pageSize };
      const res = await axios.get(`${apiConfig.apiUrl}/api/device/list`, {
        params,
      });
      setDevices(res.data.results);
      setTotalPage(res.data.totalPages);
      setTotalPageList(
        Array.from({ length: res.data.totalPages }, (_, i) => i + 1)
      );
    } catch (error: unknown) {
      showError(error);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showError = (error: unknown) => {
    const msg = axios.isAxiosError(error)
      ? error.response?.data?.message ||
        error.response?.data?.error ||
        error.message
      : error instanceof Error
      ? error.message
      : String(error);

    Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: msg });
  };

  const resetForm = () => {
    setBarcode("");
    setSerial("");
    setName("");
    setExpireDate("");
    setRemark("");
    setId(0);
  };

  const handleSave = async () => {
    if (!name) {
      Swal.fire({ icon: "error", text: "กรุณากรอกชื่อวัสดุ อุปกรณ์" });
      return;
    }

    const payload = {
      barcode,
      serial,
      name,
      expireDate: new Date(expireDate),
      remark,
    };

    try {
      if (id === 0) {
        await axios.post(`${apiConfig.apiUrl}/api/device/create`, payload);
        Swal.fire({ title: "เพิ่มข้อมูลสำเร็จ", icon: "success" });
      } else {
        await axios.put(`${apiConfig.apiUrl}/api/device/update/${id}`, payload);
        Swal.fire({ title: "แก้ไขข้อมูลสำเร็จ", icon: "success" });
      }
      handleCloseModal();
      resetForm();
      fetchData();
    } catch (error: unknown) {
      showError(error);
    }
  };

  const handleEdit = (item: Device) => {
    setBarcode(item.barcode);
    setSerial(item.serial);
    setName(item.name);
    setExpireDate(item.expireDate);
    setRemark(item.remark);
    setId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const button = await apiConfig.confirmDialog();
      if (button.isConfirmed) {
        await axios.delete(`${apiConfig.apiUrl}/api/device/remove/${id}`);
        Swal.fire({ title: "ลบข้อมูลสำเร็จ", icon: "success" });
        fetchData();
      }
    } catch (error: unknown) {
      showError(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPage));
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div className="card">
      <h1>ทะเบียนวัสดุ อุปกรณ์</h1>
      <div className="card-body">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus mr-2"></i> เพิ่มรายการ
        </button>

        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ชื่อวัสดุ</th>
              <th>Barcode</th>
              <th>Serial</th>
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
                  {item.expireDate && dayjs(item.expireDate).isValid()
                    ? dayjs(item.expireDate).format("DD/MM/YYYY")
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

        <div className="mt-3">
          <div className="btn-group">
            <button className="btn-edit" onClick={handlePrevPage}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            {totalPageList.map((item) =>
              page === item ? (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-1"
                  key={item}
                >
                  {item}
                </button>
              ) : (
                <button
                  className="btn-edit"
                  key={item}
                  onClick={() => handlePageChange(item)}
                >
                  {item}
                </button>
              )
            )}
            <button className="btn-edit" onClick={handleNextPage}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <Modal title="เพิ่มรายการ" isOpen={showModal} onClose={handleCloseModal}>
        <div>ชื่อวัสดุ อุปกรณ์</div>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-3">Barcode</div>
        <input
          type="text"
          className="form-control"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
        <div className="mt-3">Serial</div>
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
          <i className="fa-solid fa-check mr-2"></i> บันทึก
        </button>
      </Modal>
    </div>
  );
}
