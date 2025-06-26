"use client";

import { useState } from "react";
import axios from "axios";

export default function QRCode() {
  const [qrCode, setQrCode] = useState("");
  const promptpay = "0837050882";
  const amount = 100;

  const handleCreateQR = async () => {
    try {
      const response = await axios.get(
        `https://www.pp-qr.com/api/${promptpay}/${amount}`
      );

      if (response.status === 200) {
        setQrCode(response.data.qrImage);
      } else {
        alert(response.data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถดึง QR Code ได้");
    }
  };

  return (
    <div>
      {qrCode && <img src={qrCode} alt="QR Code" />}
      <button onClick={handleCreateQR}>สร้าง QR Code</button>
    </div>
  );
}
