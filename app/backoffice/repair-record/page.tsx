"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiConfig } from "@/app/apiConfig";
import Modal from "@/app/components/modal";
import Swal from "sweetalert2";
import dayjs from "dayjs";

export default function Page() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [repairRecords, setRepairRecords] = useState<RepairRecord[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceBarcode, setDeviceBarcode] = useState("");
  const [deviceSerial, setDeviceSerial] = useState("");
  const [problem, setProblem] = useState("");
  const [solving, setSolving] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [id, setId] = useState(0);

  interface Device {
    id: string;
    name: string;
    barcode: string;
    serial: string;
    expireDate: string;
  }

  interface RepairRecord {
    id: string;
    customerName: string;
    customerPhone: string;
    deviceId: string;
    deviceName: string;
    deviceBarcode: string;
    deviceSerial: string;
    expireDate: string;
    problem: string;
    solving: string;
    createdAt: Date;
    endJobDate: Date;
    status: string;
  }

  useEffect(() => {
    fetchDevices();
    fetchRepairRecords();
  }, []);

  const fetchDevices = async () => {
    const response = await axios.get(`${apiConfig.apiUrl}/api/device/list`);
    setDevices(response.data.devices);
  };

  const fetchRepairRecords = async () => {
    const response = await axios.get(
      `${apiConfig.apiUrl}/api/repair-record/list`
    );
    setRepairRecords(response.data.repairRecords);
  };

  useEffect(() => {
    const fetchDevices = async () => {
      const response = await axios.get(`${apiConfig.apiUrl}/api/device/list`);
      setDevices(response.data.devices);
    };

    const fetchRepairRecords = async () => {
      const response = await axios.get(
        `${apiConfig.apiUrl}/api/repair-record/list`
      );
      setRepairRecords(response.data.repairRecords);
    };

    fetchDevices();
    fetchRepairRecords();
  }, []);

  const handleSave = async () => {
    const payload = {
      customerName: customerName,
      customerPhone: customerPhone,
      deviceId: deviceId == "" ? undefined : deviceId,
      deviceName: deviceName,
      deviceBarcode: deviceBarcode,
      deviceSerial: deviceSerial,
      expireDate: expireDate == "" ? undefined : new Date(expireDate),
      problem: problem,
      solving: solving,
    };

    try {
      if (id == 0) {
        await axios.post(
          `${apiConfig.apiUrl}/api/repair-record/create`,
          payload
        );
        Swal.fire({
          title: "เพิ่มข้อมูลสำเร็จ",
          icon: "success",
          timer: 1500,
        });
      } else {
        await axios.put(
          `${apiConfig.apiUrl}/api/repair-record/update/${id}`,
          payload
        );
        Swal.fire({
          title: "แก้ไขข้อมูลสำเร็จ",
          icon: "success",
          timer: 1500,
        });
        setId(0);
      }

      fetchRepairRecords();
      handleCloseModal();

      setCustomerName("");
      setCustomerPhone("");
      setDeviceId("");
      setDeviceName("");
      setDeviceBarcode("");
      setDeviceSerial("");
      setExpireDate("");
      setProblem("");
      setSolving("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;
        const status = error.response?.status;

        Swal.fire({
          icon: "error",
          title: "มีข้อผิดพลาด",
          text: `Status: ${status} - ${msg}`,
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

  const handleEdit = (repairRecord: RepairRecord) => {
    setId(parseInt(repairRecord.id));
    setCustomerName(repairRecord.customerName);
    setCustomerPhone(repairRecord.customerPhone);

    if (repairRecord.deviceId) {
      setDeviceId(repairRecord.deviceId);
    }

    setDeviceName(repairRecord.deviceName);
    setDeviceBarcode(repairRecord.deviceBarcode);
    setDeviceSerial(repairRecord.deviceSerial);
    setProblem(repairRecord.problem);
    setSolving(repairRecord.solving);
    setExpireDate(dayjs(repairRecord.expireDate).format("YYYY-MM-DD"));
    handleShowModal();
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setId(0);
    setCustomerName("");
    setCustomerPhone("");
    setDeviceId("");
    setDeviceName("");
    setDeviceBarcode("");
    setDeviceSerial("");
    setExpireDate("");
    setProblem("");
    setSolving("");
  };

  const handleChangeDevice = (deviceId: string) => {
    const device = devices.find(
      (device) => parseInt(device.id) === parseInt(deviceId)
    );
    if (device) {
      setDeviceId(device.id);
      setDeviceName(device.name);
      setDeviceBarcode(device.barcode);
      setDeviceSerial(device.serial);
      setExpireDate(dayjs(device.expireDate).format("YYYY-MM-DD"));
    } else {
      setDeviceId("");
      setDeviceName("");
      setDeviceBarcode("");
      setDeviceSerial("");
      setExpireDate("");
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case "active":
        return "รอซ่อม";
      case "pending":
        return "รอลูกค้ายืนยัน";
      case "repairing":
        return "กำลังซ่อม";
      case "done":
        return "ซ่อมเสร็จ";
      case "cancel":
        return "ยกเลิก";
      case "complete":
        return "ลูกค้ามารับอุปกรณ์";
      default:
        return "รอซ่อม";
    }
  };

  const handleDelete = async (id: string) => {
    await apiConfig.confirmDialog().then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(
          `${apiConfig.apiUrl}/api/repair-record/remove/${id}`
        );
        Swal.fire({
          title: "ลบข้อมูลสำเร็จ",
          icon: "success",
        });
        fetchRepairRecords();
      }
    });
  };
  return (
    <>
      <div className="card">
        <h1>บันทึกการซ่อม</h1>
        <div className="card-body">
          <button className="btn btn-primary" onClick={handleShowModal}>
            <i className="fa-solid fa-plus mr-2"></i>
            เพิ่มการซ่อม
          </button>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>ชื่อลูกค้า</th>
                <th>เบอร์โทรศัพท์</th>
                <th>อุปกรณ์</th>
                <th>อาการเสีย</th>
                <th>วันที่รับซ่อม</th>
                <th>วันที่ซ่อมเสร็จ</th>
                <th>สถานะ</th>
                <th style={{ width: "150px" }}></th>
              </tr>
            </thead>
            <tbody>
              {repairRecords.map((repairRecord) => (
                <tr key={repairRecord.id}>
                  <td>{repairRecord.customerName}</td>
                  <td>{repairRecord.customerPhone}</td>
                  <td>{repairRecord.deviceName}</td>
                  <td>{repairRecord.problem}</td>
                  <td>{dayjs(repairRecord.createdAt).format("DD/MM/YYYY")}</td>
                  <td>
                    {repairRecord.endJobDate
                      ? dayjs(repairRecord.endJobDate).format("DD/MM/YYYY")
                      : "-"}
                  </td>
                  <td>{getStatusName(repairRecord.status)}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(repairRecord)}
                    >
                      <i className="fa-solid fa-edit"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(repairRecord.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="เพิ่มการซ่อม"
        size="lg"
      >
        <div className="flex gap-4">
          <div className="w-1/2">
            <div>ชื่อลูกค้า</div>
            <input
              type="text"
              className="form-control w-full"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <div>เบอร์โทรศัพท์</div>
            <input
              type="text"
              className="form-control w-full"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <div>ชื่ออุปกรณ์ (ในระบบ)</div>
          <select
            className="form-control w-full"
            value={deviceId}
            onChange={(e) => {
              handleChangeDevice(e.target.value);
            }}
          >
            <option value="">--- เลือกอุปกรณ์ ---</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <div>ชื่ออุปกรณ์ (นอกระบบ)</div>
          <input
            type="text"
            className="form-control w-full"
            value={deviceName}
            onChange={(e) => {
              setDeviceName(e.target.value);
            }}
            disabled={deviceId !== ""}
          />
          {deviceId !== "" && (
            <p className="text-red-500 text-sm mt-1">
              ไม่สามารถกรอกชื่ออุปกรณ์นอกระบบได้
              เพราะได้เลือกจากอุปกรณ์ในระบบแล้ว
            </p>
          )}
        </div>

        <div className="flex gap-4 mt-4">
          <div className="w-1/2">
            <div>barcode</div>
            <input
              type="text"
              className="form-control w-full"
              value={deviceBarcode}
              onChange={(e) => setDeviceBarcode(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <div>serial</div>
            <input
              type="text"
              className="form-control w-full"
              value={deviceSerial}
              onChange={(e) => setDeviceSerial(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <div>วันหมดประกัน</div>
          <input
            type="date"
            className="form-control w-full"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <div>อาการเสีย</div>
          <textarea
            className="form-control w-full"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>

        <button className="btn btn-primary mt-5" onClick={handleSave}>
          <i className="fa-solid fa-check mr-2"></i>
          บันทึก
        </button>
      </Modal>
    </>
  );
}
