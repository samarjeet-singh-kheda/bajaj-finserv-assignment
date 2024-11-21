import express from "express";
import cors from "cors";
import { handlePostRequest, handleGetRequest } from "./helper.js";

const app = express();

app.use(express.json());
app.use(
  cors({ origin: "https://bajaj-finserv-assignment-samarjeet.vercel.app" })
);

app.post("/api", handlePostRequest);
app.get("/api", handleGetRequest);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
