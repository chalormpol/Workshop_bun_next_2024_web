"use client";

import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { apiConfig } from "@/app/apiConfig";

export default function IncomeReportPage() {
  const [startDate, setStartDate] = useState(
    dayjs().subtract(14, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [listIncome, setListIncome] = useState<IncomeReport[]>([]);

  interface IncomeReport {
    id: number;
    customerName: string;
    customerPhone: string;
    deviceName: string;
    createdAt: string;
    payDate: string;
    solving: string;
    amount: number;
  }

  const fetchIncome = useCallback(async () => {
    const response = await axios.get(
      apiConfig.apiUrl + `/api/income/report/${startDate}/${endDate}`
    );
    setListIncome(response.data);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchIncome();
  }, [fetchIncome]);

  return (
    <>
      <div className="card">
        <h1>รายงานรายได้</h1>
        <div className="card-body">
          <div className="flex gap-4 items-center">
            <div className="w-[80px] text-right">จากวันที่</div>
            <div className="w-[200px]">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control w-full"
              />
            </div>
            <div className="w-[80px] text-right">ถึงวันที่</div>
            <div className="w-[200px]">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control w-full"
              />
            </div>
            <div className="w-[200px]">
              <button
                className="btn btn-primary"
                style={{ marginTop: "5px" }}
                onClick={fetchIncome}
              >
                <i className="fa-solid fa-magnifying-glass mr-3"></i>
                ค้นหา
              </button>
            </div>
          </div>

          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ลูกค้า</th>
                <th>เบอร์โทรศัพท์</th>
                <th>อุปกรณ์</th>
                <th>วันที่เเจ้งซ่อม</th>
                <th>วันที่ชำระเงิน</th>
                <th>รายการ</th>
                <th style={{ textAlign: "right" }}>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {listIncome.length > 0 &&
                listIncome.map((item: IncomeReport) => (
                  <tr key={item.id}>
                    <td>{item.customerName}</td>
                    <td>{item.customerPhone}</td>
                    <td>{item.deviceName}</td>
                    <td>{dayjs(item.createdAt).format("DD/MM/YYYY")}</td>
                    <td>{dayjs(item.payDate).format("DD/MM/YYYY")}</td>
                    <td>{item.solving}</td>
                    <td style={{ textAlign: "right" }}>
                      {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              <tr>
                <td colSpan={4}></td>
                <td colSpan={2}>
                  <b style={{ marginRight: "10px" }}>ระยะเวลา :</b>
                  {dayjs(endDate).diff(dayjs(startDate), "day") === 0
                    ? "วันนี้"
                    : `${dayjs(endDate).diff(dayjs(startDate), "day")} วัน`}
                </td>
                <td style={{ textAlign: "right" }}>
                  <b style={{ marginRight: "10px" }}>รายได้ทั้งหมด</b>
                  {listIncome
                    .reduce((acc, item) => acc + item.amount, 0)
                    .toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
