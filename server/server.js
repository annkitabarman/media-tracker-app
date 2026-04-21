require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const BASE_URL = process.env.TMDB_BASE_URL;
const API_KEY = process.env.TMDB_API_KEY;
const PORT = process.env.PORT || 3000;

async function fetchWithRetry(url, options = {}, retries = 2) {
  try {
    return await axios.get(url, options);
  } catch (err) {
    if (retries > 0 && err.code == "ECONNRESET") {
      console.log("Retrying...");
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

app.use("/tmdb", async (req, res) => {
  const path = req.path.slice(1);

  try {
    const response = await fetchWithRetry(`${BASE_URL}/${path}`, {
      params: {
        ...req.query,
        api_key: API_KEY,
      },
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("TMDB ERROR:", err.response?.data || err.message);

    res.status(err.response?.status || 500).json({
      error: "Failed to fetch data from TMDB",
      details: err.response?.data || err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
