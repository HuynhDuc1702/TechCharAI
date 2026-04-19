//Note: Chạy lệnh taskkill /IM node.exe /F nếu gặp lỗi cannot get do  
// có một node process đang chạy rồi
import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import rootRouter from "./routes";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;


const start = async () => {
  await connectDB();
  app.use(cookieParser());
  app.use("/api", rootRouter)
  //await redis.connect();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();