"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import axios from "axios";
import { apiConfig } from "@/app/apiConfig";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import ApexCharts from "apexcharts";

export default function Page() {
  const [totalRepairRecord, setTotalRepairRecord] = useState(0);
  const [totalRepairRecordNotComplete, setTotalRepairRecordNotComplete] =
    useState(0);
  const [totalRepairRecordComplete, setTotalRepairRecordComplete] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [listYear, setListYear] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [selectedYearChartIncomePerMonth, setSelectedYearChartIncomePerMonth] =
    useState(dayjs().year());

  const listMonth = useMemo(
    () => [
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
    []
  );

  const chartIncomePerDayRef = useRef<HTMLDivElement>(null);
  const chartIncomePerMonthRef = useRef<HTMLDivElement>(null);
  const chartPieRef = useRef<HTMLDivElement>(null);

  const incomeDayChartInstance = useRef<ApexCharts | null>(null);
  const incomeMonthChartInstance = useRef<ApexCharts | null>(null);
  const pieChartInstance = useRef<ApexCharts | null>(null);

  interface IncomePerDay {
    day: number;
    amount: number;
  }

  interface IncomePerMonth {
    month: number;
    amount: number;
  }

  interface DashboardResponse {
    totalRepairRecord: number;
    totalRepairRecordNotComplete: number;
    totalRepairRecordComplete: number;
    totalAmount: number;
    listIncomePerDays: IncomePerDay[];
  }

  const renderChartIncomePerDay = useCallback(async (data: number[]) => {
    incomeDayChartInstance.current?.destroy();

    const ApexCharts = (await import("apexcharts")).default;

    const options = {
      chart: { type: "bar", height: 250, background: "white" },
      series: [{ name: "รายได้", data }],
      xaxis: { categories: Array.from({ length: 31 }, (_, i) => i + 1) },
    };

    if (chartIncomePerDayRef.current) {
      incomeDayChartInstance.current = new ApexCharts(
        chartIncomePerDayRef.current,
        options
      );
      incomeDayChartInstance.current.render();
    }
  }, []);

  const renderChartIncomePerMonth = useCallback(
    async (data: number[]) => {
      incomeMonthChartInstance.current?.destroy();

      const ApexCharts = (await import("apexcharts")).default;

      const options = {
        chart: { type: "bar", height: 250, background: "white" },
        series: [{ name: "รายได้", data }],
        xaxis: { categories: listMonth },
      };

      if (chartIncomePerMonthRef.current) {
        incomeMonthChartInstance.current = new ApexCharts(
          chartIncomePerMonthRef.current,
          options
        );
        incomeMonthChartInstance.current.render();
      }
    },
    [listMonth]
  );

  const renderChartPie = useCallback(
    async (complete: number, notComplete: number, total: number) => {
      pieChartInstance.current?.destroy();

      const ApexCharts = (await import("apexcharts")).default;

      const options = {
        chart: { type: "pie", height: 250, background: "white" },
        series: [complete, notComplete, total],
        labels: ["งานซ่อมสำเร็จ", "งานกำลังซ่อม", "งานซ่อมทั้งหมด"],
      };

      if (chartPieRef.current) {
        pieChartInstance.current = new ApexCharts(chartPieRef.current, options);
        pieChartInstance.current.render();
      }
    },
    []
  );

  const fetchDataIncomePerDay = useCallback(async () => {
    try {
      const params = {
        year: selectedYear,
        month: selectedMonth + 1,
      };

      const { data } = await axios.get<DashboardResponse>(
        `${apiConfig.apiUrl}/api/repair-record/dashboard`,
        { params }
      );

      setTotalRepairRecord(data.totalRepairRecord);
      setTotalRepairRecordNotComplete(data.totalRepairRecordNotComplete);
      setTotalRepairRecordComplete(data.totalRepairRecordComplete);
      setTotalAmount(data.totalAmount);

      const listIncomePerDays = data.listIncomePerDays.map(
        (item: IncomePerDay) => item.amount
      );

      renderChartIncomePerDay(listIncomePerDays);
      renderChartPie(
        data.totalRepairRecordComplete,
        data.totalRepairRecordNotComplete,
        data.totalRepairRecord
      );
    } catch (error) {
      handleAxiosError(error);
    }
  }, [selectedYear, selectedMonth, renderChartIncomePerDay, renderChartPie]);

  const fetchDataChartIncomePerMonth = useCallback(async () => {
    try {
      const { data } = await axios.get<IncomePerMonth[]>(
        `${apiConfig.apiUrl}/api/repair-record/income-per-month`,
        {
          params: { year: selectedYearChartIncomePerMonth },
        }
      );

      const listIncomePerMonth = data.map(
        (item: IncomePerMonth) => item.amount
      );
      renderChartIncomePerMonth(listIncomePerMonth);
    } catch (error) {
      handleAxiosError(error);
    }
  }, [selectedYearChartIncomePerMonth, renderChartIncomePerMonth]);

  const fetchData = useCallback(() => {
    fetchDataIncomePerDay();
    fetchDataChartIncomePerMonth();
  }, [fetchDataIncomePerDay, fetchDataChartIncomePerMonth]);

  useEffect(() => {
    const currentYear = dayjs().year();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    setListYear(years);
    fetchData();
  }, [fetchData]);

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

  return (
    <>
      <div className="text-2xl font-bold">Dashboard</div>

      <div className="flex mt-5 gap-4">
        {/* Cards */}
        {[
          ["งานซ่อมทั้งหมด", totalRepairRecord, "bg-indigo-500"],
          ["งานค้างซ่อม", totalRepairRecordNotComplete, "bg-pink-500"],
          ["งานกำลังดำเนินการ", totalRepairRecordComplete, "bg-red-500"],
          ["รายได้เดือนนี้", totalAmount, "bg-green-500"],
        ].map(([label, value, color], i) => (
          <div key={i} className={`w-1/4 ${color} p-4 rounded-lg text-right`}>
            <div className="text-xl font-bold">{label}</div>
            <div className="text-4xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="text-2xl font-bold mt-5 mb-2">รายได้ต่อวัน</div>

      <div className="flex gap-4 mb-5 mt-2 items-end">
        <div>
          <div className="text-xl font-bold">ปี</div>
          <select
            className="form-control"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {listYear.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="text-xl font-bold">เดือน</div>
          <select
            className="form-control"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {listMonth.map((month, i) => (
              <option key={i} value={i}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <button className="btn ms-2" onClick={fetchDataIncomePerDay}>
          <i className="fa-solid fa-magnifying-glass"></i> แสดงข้อมูล
        </button>
      </div>

      <div ref={chartIncomePerDayRef}></div>

      <div className="text-2xl font-bold mt-5 mb-2">รายได้รายเดือน</div>

      <div className="flex gap-3 mb-2">
        <select
          className="form-control w-[120px]"
          value={selectedYearChartIncomePerMonth}
          onChange={(e) =>
            setSelectedYearChartIncomePerMonth(parseInt(e.target.value))
          }
        >
          {listYear.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button className="btn ms-2" onClick={fetchDataChartIncomePerMonth}>
          <i className="fa-solid fa-magnifying-glass ms-2"></i> แสดงข้อมูล
        </button>
      </div>

      <div className="flex gap-4">
        <div className="w-2/3" ref={chartIncomePerMonthRef}></div>
        <div className="w-1/3" ref={chartPieRef}></div>
      </div>
    </>
  );
}
