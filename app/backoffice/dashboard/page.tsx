"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { apiConfig } from "@/app/apiConfig";
// import Swal from "sweetalert2";
import Chart from "apexcharts";

export default function Page() {
  const [totalRepairRecord, setTotalRepairRecord] = useState(0);
  const [totalRepairRecordNotComplete, setTotalRepairRecordNotComplete] =
    useState(0);
  const [totalRepairRecordComplete, setTotalRepairRecordComplete] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchData = useCallback(async () => {
    const response = await axios.get(
      apiConfig.apiUrl + "/api/repair-record/dashboard"
    );
    setTotalRepairRecord(response.data.totalRepairRecord);
    setTotalRepairRecordNotComplete(response.data.totalRepairRecordNotComplete);
    setTotalRepairRecordComplete(response.data.totalRepairRecordComplete);
    setTotalAmount(response.data.totalAmount);

    renderChartIncomePerDay();
    renderChartIncomePerMonth();
    renderChartPie(
      response.data.totalRepairRecordComplete,
      response.data.totalRepairRecordNotComplete,
      response.data.totalRepairRecord
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderChartIncomePerDay = () => {
    // random data 31 days
    const data = Array.from({ length: 31 }, () =>
      Math.floor(Math.random() * 10000)
    );

    const options = {
      chart: {
        type: "bar",
        height: 250,
        background: "white",
      },
      series: [
        {
          data: data,
        },
      ],
      xaxis: {
        categories: Array.from({ length: 31 }, (_, i) => i + 1),
      },
    };

    const chartIncomePerDay = document.getElementById("chart-income-per-day");
    const chart = new Chart(chartIncomePerDay, options);
    chart.render();
  };

  const renderChartIncomePerMonth = () => {
    // random data 12 months
    const data = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 10000)
    );

    const options = {
      chart: {
        type: "bar",
        height: 250,
        background: "white",
      },
      series: [
        {
          data: data,
        },
      ],
      xaxis: {
        categories: [
          "มกราคม",
          "กุมภาพันธ์",
          "มีนาคม",
          "เมษายน",
          "พฤษภาคม",
          "มิถุนายน",
          "กรกฎาคม",
          "สิงหาคม",
          "กันยายน",
          "ตุลาคม",
          "พฤศจิกายน",
          "ธันวาคม",
        ],
      },
    };

    const chartIncomePerMonth = document.getElementById(
      "chart-income-per-month"
    );
    const chart = new Chart(chartIncomePerMonth, options);
    chart.render();
  };

  const renderChartPie = (
    totalRepairRecordComplete: number,
    totalRepairRecordNotComplete: number,
    totalRepairRecord: number
  ) => {
    const data = [
      totalRepairRecordComplete,
      totalRepairRecordNotComplete,
      totalRepairRecord,
    ];
    const options = {
      chart: {
        type: "pie",
        height: 250,
        background: "white",
      },
      series: data,
      labels: ["งานซ่อมสำเร็จ", "งานกำลังซ่อม", "งานซ่อมทั้งหมด"],
    };
    const chartPie = document.getElementById("chartPie");
    const chart = new Chart(chartPie, options);
    chart.render();
  };

  return (
    <>
      <div className="text-2xl font-bold">Dashboard</div>
      <div className="flex mt-5 gap-4">
        <div className="w-1/4 bg-indigo-500 p-4 rounded-lg text-right">
          <div className="text-xl font-bold">งานซ่อมทั้งหมด</div>
          <div className="text-4xl font-bold">{totalRepairRecord}</div>
        </div>
        <div className="w-1/4 bg-pink-500 p-4 rounded-lg text-right">
          <div className="text-xl font-bold">งานค้างซ่อม</div>
          <div className="text-4xl font-bold">
            {totalRepairRecordNotComplete}
          </div>
        </div>
        <div className="w-1/4 bg-red-500 p-4 rounded-lg text-right">
          <div className="text-xl font-bold">งานกำลังดำเนินการ</div>
          <div className="text-4xl font-bold">{totalRepairRecordComplete}</div>
        </div>
        <div className="w-1/4 bg-green-500 p-4 rounded-lg text-right">
          <div className="text-xl font-bold">รายได้เดือนนี้</div>
          <div className="text-4xl font-bold">{totalAmount}</div>
        </div>
      </div>

      <div className="text-2xl font-bold mt-5 mb-2">รายได้ต่อวัน</div>
      <div id="chart-income-per-day"></div>

      <div className="flex gap-4">
        <div className="w-2/3">
          <div className="text-2xl font-bold mt-5 mb-2">รายได้ต่อเดือน</div>
          <div id="chart-income-per-month"></div>
        </div>
        <div className="w-1/3">
          <div className="text-2xl font-bold mt-5 mb-2">งานทั้งหมด</div>
          <div id="chartPie"></div>
        </div>
      </div>
    </>
  );
}
