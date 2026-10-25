import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import attendantRoutes from './routes/attendantRoutes.js';
import attributesRoutes from './routes/attributeRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import motorcycleRoutes from './routes/motorcycleRoutes.js';

import reportsRoutes from './routes/reportsRoutes.js';

import managerRoutes from './routes/managerRoutes.js';

import userRoutes from './routes/userRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import travelRoutes from './routes/travelRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import reviewsRoutes from './routes/reviewRoutes.js'
import supportRoutes from './routes/supportRoutes.js';
import supportMessagesRoutes from './routes/supportMessageRoutes.js';
import companiesRoutes from './routes/companyRoutes.js';


import userAuthRoutes from './routes/auth/authUserRoutes.js';
import attendantAuthRoutes from './routes/auth/authAttendantRoutes.js';
import managerAuthRoutes from './routes/auth/authManagerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API is running",
        status: "OK",
        version: "1.0.0"
    });
});


app.use("/api/attendants", attendantRoutes);
app.use("/api/attributes", attributesRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/motorcycles", motorcycleRoutes);

app.use("/api/managers", managerRoutes);

app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/travels", travelRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/supports", supportRoutes);
app.use("/api/support-messages", supportMessagesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/companies", companiesRoutes);

app.use("/api/auth/user", userAuthRoutes);
app.use("/api/auth/attendant", attendantAuthRoutes);
app.use("/api/auth/manager", managerAuthRoutes);




app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada"
  });
});

app.use((err, req, res, next) => {
  console.error("ERRO GLOBAL", err);

  res.status(500).json({
    success: false,
    message: "Erro interno do servidor"
  });
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});