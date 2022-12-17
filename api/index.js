const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8800;
const rp = require("request-promise");
const cors = require("cors");

const API_KEY = "bd0ee7a6-1b95-49a6-8947-26d3e9ec2248";
const baseURL = "https://pro-api.coinmarketcap.com";
const latestCoinsURL = "/v1/cryptocurrency/listings/latest";
const chartDataURL = "/v1/cryptocurrency/quotes/historical";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", router);

router.get("/latestCoins", async (req, res) => {
  try {
    const requestOptions = {
      method: "GET",
      uri: `${baseURL}${latestCoinsURL}`,
      qs: {
        start: 1,
        limit: 1,
        convert: "USD",
        time_start: req.query.startDate,
        time_end: req.query.endDate,
      },
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
      },
      json: true,
      gzip: true,
    };
    const apiResponse = await rp(requestOptions);

    if (apiResponse.error) {
      console.log(res);
      return res.status(500).json({
        success: "false",
        message: "Error fetching coin data",
      });
    } else {
      return res.status(200).json({
        success: "true",
        message: "coin retrieved successfully",
        body: apiResponse,
      });
    }
  } catch (err) {
    console.log("Server API call error:", err.message);
    return res.status(500).json({
      success: "false",
      message: "Error fetching coin data",
    });
  }
});

router.get("/historicalData", async (req, res) => {
  console.log("req:", req);
  console.log("res:", res);
  // console.log("requestOptions", requestOptions);
  try {
    const requestOptions = {
      method: "GET",
      uri: `${baseURL}${latestCoinsURL}`,
      qs: {
        // id: req.query.id, // The ID of the cryptocurrency to retrieve data for
        time_start: req.query.startDate, // The start date for the historical data
        time_end: req.query.endDate, // The end date for the historical data
        // interval: req.query.interval, // The interval for the data points (e.g. "1d" for daily data)
        convert: "USD",
      },
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
      },
      json: true,
      gzip: true,
    };
    const apiResponse = await rp(requestOptions);

    if (apiResponse.error) {
      console.log("res", res);
      return res.status(500).json({
        success: "false",
        message: "Error fetching historical data",
      });
    } else {
      return res.status(200).json({
        success: "true",
        message: "historical data retrieved successfully",
        body: apiResponse,
      });
    }
  } catch (err) {
    console.log("Server API call error:", err.message);
    return res.status(500).json({
      success: "false",
      message: "Error fetching historical data",
    });
  }
});

app.listen(port, () => console.log(`Server listening on port: ${port}`));
