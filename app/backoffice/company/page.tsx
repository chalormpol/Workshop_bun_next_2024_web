"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { apiConfig } from "@/app/apiConfig";
import Swal from "sweetalert2";

export default function CompanyPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebookPage, setFacebook] = useState("");
  const [taxCode, setTaxCode] = useState("");

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem(apiConfig.tokenKey);
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(apiConfig.apiUrl + "/api/company/info", {
        headers: headers,
      });

      if (response.data.id !== undefined) {
        setName(response.data.name ?? "");
        setAddress(response.data.address ?? "");
        setPhone(response.data.phone ?? "");
        setEmail(response.data.email ?? "");
        setFacebook(response.data.facebookPage ?? "");
        setTaxCode(response.data.taxCode ?? "");
      }
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

  const saveCompany = async () => {
    try {
      const payload = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        facebookPage: facebookPage,
        taxCode: taxCode,
      };

      await axios.put(apiConfig.apiUrl + "/api/company/update", payload);

      Swal.fire({
        icon: "success",
        title: "บันทึกข้อมูล",
        text: "ข้อมูลร้านถูกบันทึกสำเร็จ",
        timer: 1500,
      });

      fetchCompany();
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
    <div className="card">
      <h1>ข้อมูลร้าน</h1>
      <div className="card-body">
        <div>ชื่อร้าน</div>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control w-full"
          />
        </div>
        <div>ที่อยู่</div>
        <div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-control w-full"
          />
        </div>
        <div>เบอร์โทรศัพท์</div>
        <div>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-control w-full"
          />
        </div>
        <div>อีเมล</div>
        <div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control w-full"
          />
        </div>
        <div>Facebook Page</div>
        <div>
          <input
            type="text"
            value={facebookPage}
            onChange={(e) => setFacebook(e.target.value)}
            className="form-control w-full"
          />
        </div>
        <div>รหัสภาษี</div>
        <div>
          <input
            type="text"
            value={taxCode}
            onChange={(e) => setTaxCode(e.target.value)}
            className="form-control w-full"
          />
        </div>
        <div>
          <button className="btn btn-primary" onClick={saveCompany}>
            <i className="fa-solid fa-check mr-3"></i>
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
