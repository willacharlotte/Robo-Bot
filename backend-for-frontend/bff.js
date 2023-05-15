import "dotenv/config";
import getSplash from "./handlers/get-splash.js";
import express from "express";

const PORT = process.env.BFF_PORT || 3001;

const bff = express();
bff.use(express.static("./frontend/"));

bff.get("/", getSplash)

bff.listen(PORT, () => {
  console.log(`bff started on port: ${PORT}`)
})