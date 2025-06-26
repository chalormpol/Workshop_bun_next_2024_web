"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiConfig } from "@/app/apiConfig";
import Swal from "sweetalert2";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page() {
  const [repairRecords, setRepairRecords] = useState<RepairRecord[]>([]);
  const [tempRepairRecords, setTempRepairRecords] = useState<RepairRecord[]>(
    []
  );
  const [engineers, setEngineers] = useState<Engineer[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(0);
  const [engineerId, setEngineerId] = useState(0);
  const [status, setStatus] = useState("");
  const [solving, setSolving] = useState("");
  const [statusList] = useState([
    { value: "active", label: "รอซ่อม" },
    { value: "pending", label: "รอลูกค้ายืนยัน" },
    { value: "repairing", label: "กำลังซ่อม" },
    { value: "done", label: "ซ่อมเสร็จ" },
    { value: "cancel", label: "ยกเลิก" },
    { value: "complete", label: "ลูกค้ามารับอุปกรณ์" },
  ]);
  const [statusForFilter, setStatusForFilter] = useState("");

  ///รับเครื่อง
  const [showModalReceive, setShowModalReceive] = useState(false);
  const [receiveCustomerName, setReceiveCustomerName] = useState("");
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [receiveId, setReceiveId] = useState(0);

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
    engineerId: string;
    engineer?: {
      username: string;
    };
    amount: string;
  }

  interface Engineer {
    id: string;
    username: string;
  }

  useEffect(() => {
    fetchRepairRecords();
    fetchEngineers();
  }, []);

  const fetchRepairRecords = async () => {
    try {
      const response = await axios.get(
        `${apiConfig.apiUrl}/api/repair-record/list`
      );
      setRepairRecords(response.data.repairRecords);
      setTempRepairRecords(response.data.repairRecords);
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

  const fetchEngineers = async () => {
    try {
      const response = await axios.get(
        `${apiConfig.apiUrl}/api/user/listEngineer`
      );
      setEngineers(response.data.engineers);
      setEngineerId(parseInt(response.data.engineers[0].id));
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

  const handleSave = async () => {
    const payload = {
      status: status,
      solving: solving,
      engineerId: engineerId,
    };

    try {
      await axios.put(
        `${apiConfig.apiUrl}/api/repair-record/updateStatus/${id}`,
        payload
      );
      Swal.fire({
        title: "แก้ไขข้อมูลสำเร็จ",
        icon: "success",
        timer: 1500,
      });

      fetchRepairRecords();
      handleCloseModal();

      setStatus("");
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

  const getStatusName = (status: string) => {
    const statusObj = statusList.find((item) => item.value === status);
    return statusObj?.label || "รอซ่อม";
  };

  const handleEdit = (repairRecord: RepairRecord) => {
    const repairRecordData = repairRecords.find(
      (repairRecord: RepairRecord) => repairRecord.id === repairRecord.id
    );

    if (repairRecordData) {
      setEngineerId(parseInt(repairRecord?.engineerId ?? "0"));
      setId(parseInt(repairRecord.id));
      setStatus(repairRecord?.status ?? "");
      setSolving(repairRecord?.solving ?? "");
      handleShowModal();
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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFilter = (statusForFilter: string) => {
    if (statusForFilter) {
      const filteredRecords = tempRepairRecords.filter(
        (item) => item.status === statusForFilter
      );
      setRepairRecords(filteredRecords);
      setStatusForFilter(statusForFilter);
    } else {
      setRepairRecords(tempRepairRecords);
      setStatusForFilter("");
    }
  };

  const openModalReceive = (repairRecord: RepairRecord) => {
    setShowModalReceive(true);
    setReceiveCustomerName(repairRecord.customerName);
    setReceiveAmount(0);
    setReceiveId(parseInt(repairRecord.id));
  };

  const handleCloseModalReceive = () => {
    setShowModalReceive(false);
    setReceiveId(0); //รีเซ็ต id
  };

  const handleReceive = async () => {
    const payload = {
      id: receiveId,
      amount: receiveAmount,
    };

    try {
      await axios.put(
        `${apiConfig.apiUrl}/api/repair-record/receive/`,
        payload
      );
      Swal.fire({
        title: "รับเครื่องสำเร็จ",
        icon: "success",
      });

      fetchRepairRecords();
      handleCloseModalReceive();
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

  return (
    <>
      <div className="card">
        <h1>สถานะการซ่อมอุปกรณ์</h1>
        <div>
          <select
            className="form-control"
            value={statusForFilter}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {statusList.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ช่างซ่อม</th>
                <th>ชื่อลูกค้า</th>
                <th>เบอร์โทรศัพท์</th>
                <th>อุปกรณ์</th>
                <th>อาการเสีย</th>
                <th>วันที่รับซ่อม</th>
                <th>วันที่ซ่อมเสร็จ</th>
                <th>สถานะ</th>
                <th className="text-right" style={{ paddingRight: "4px" }}>
                  ค่าบริการ
                </th>
                <th style={{ width: "330px" }}></th>
              </tr>
            </thead>
            <tbody>
              {repairRecords.map((repairRecord) => (
                <tr key={repairRecord.id}>
                  <td>{repairRecord.engineer?.username ?? "-"}</td>
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
                  <td className="text-right">
                    {repairRecord.amount
                      ? parseFloat(repairRecord.amount).toLocaleString(
                          "th-TH",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openModalReceive(repairRecord)}
                    >
                      <i className="fa-solid fa-check mr-2"></i>รับเครื่อง
                    </button>
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
        title="สถานะการซ่อมอุปกรณ์"
        isOpen={showModal}
        onClose={() => handleCloseModal()}
      >
        <div className="flex gap-4">
          <div className="w-1/2">
            <div>สถานะการซ่อมอุปกรณ์</div>
            <select
              className="form-control w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusList.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <div>เลือกช่างซ่อม</div>
            <select
              className="form-control w-full"
              value={engineerId}
              onChange={(e) => setEngineerId(parseInt(e.target.value))}
            >
              {engineers.map((engineer) => (
                <option key={engineer.id} value={engineer.id}>
                  {engineer.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div>การเเก้ไข</div>
          <textarea
            className="form-control w-full"
            rows={5}
            value={solving}
            onChange={(e) => setSolving(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary mt-4" onClick={() => handleSave()}>
          <i className="fa-solid fa-check mr-2"></i> บันทึก
        </button>
      </Modal>

      <Modal
        title="รับเครื่อง"
        isOpen={showModalReceive}
        onClose={() => handleCloseModalReceive()}
        size="xl"
      >
        <div className="flex gap-4">
          <div className="w-1/2">
            <div>ชื่อลูกค้า</div>
            <input
              className="form-control w-full disabled"
              readOnly
              value={receiveCustomerName}
            />
          </div>
          <div className="w-1/2">
            <div>ค่าบริการ</div>
            <input
              type="text"
              className="form-control w-full text-right"
              value={receiveAmount === 0 ? "0" : receiveAmount || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setReceiveAmount(value === "" ? 0 : parseFloat(value) || 0);
                } else {
                  Swal.fire({
                    icon: "error",
                    title: "กรุณาป้อนตัวเลขเท่านั้น",
                    timer: 1500,
                  });
                }
              }}
            />
          </div>
        </div>

        <div>
          <button className="btn-primary mt-4" onClick={() => handleReceive()}>
            <i className="fa-solid fa-check mr-2"></i> บันทึก
          </button>
        </div>
      </Modal>
    </>
  );
}
