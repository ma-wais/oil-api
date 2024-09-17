import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/index.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';

const app = express();

dotenv.config({ path: "./.env" });
connectDB();

const PORT = process.env.PORT || 5000;
const whitelist = ['http://localhost:5173', "https://oil-teal.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
