import Swal from "sweetalert2";

export const apiConfig = {
  apiUrl: "https://workshopbunnext2024api-production.up.railway.app/",
  tokenKey: "token_bun_service",
  confirmDialog: () => {
    return Swal.fire({
      icon: "question",
      iconColor: "#9ca3af",
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบรายการนี้หรือไม่",
      showCancelButton: true,
      background: "#1f2937",
      color: "#9ca3af",
      customClass: {
        title: "custom-title-class",
        htmlContainer: "custom-text-class",
      },
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });
  },
};

export default apiConfig;
