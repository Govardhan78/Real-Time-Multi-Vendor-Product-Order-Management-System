const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTRiNzZiNDhhMjVkMmM4ZjMyNzBlNmYiLCJyb2xlIjoic2VsbGVyIiwiaWF0IjoxNzgzMzM0MzYzLCJleHAiOjE3ODM5MzkxNjN9.CorqzcMTevUOvwTKYxRgrx-_KiQUA_uYM-j7vzWvzCc",
  },
});

socket.on("connect", () => {
  console.log("Connected");
});

socket.on("newOrder", (data) => {
  console.log("New Order");
  console.log(data);
});

socket.on("orderStatusChanged", (data) => {
  console.log("🛠 Admin Notification");
  console.log(data);
});

socket.on("orderStatusUpdated", (data) => {
  console.log("Customer Notification");
  console.log(data);
});

socket.on("lowStock", (data) => {
  console.log("Low Stock");
  console.log(data);
});
