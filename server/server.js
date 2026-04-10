require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;
const PORT = process.env.PORT || 3000;

app.use("/tmdb", async (req, res) => {
  const path = req.path.slice(1);
  console.log("Incoming request:", req.method, req.originalUrl);
  console.log(path);

  try {
    const response = await axios.get(`${BASE_URL}/${path}`, {
      params: {
        ...req.query,
        api_key: API_KEY,
      },
    });

    res.json(response.data);
  } catch {
    console.error(`Error fetching data from TMDB for path: ${path}`);
    res.status(500).json({ error: "Failed to fetch data from TMDB" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
