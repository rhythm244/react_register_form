import axios from "axios";
const BASE_URL = "http://localhost:3500";

export default axios.create({
  baseURL: BASE_URL,
});

//เราต้องการส่งอะไรบางอย่างไปกับ axios ในการ call แต่ละครั้ง
//ฟังก์ชั่นที่จะนำมาใช้คือ interceptor
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    withCredentials: true,
  },
});
