import React, { useState, useEffect } from "react";
import axios from "axios";
import "./card.css";

const CoinData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/historicalData", {
          params: {
            id: 1,
            time_start: "2022-01-01",
            time_end: "2022-12-31",
            interval: "1d",
          },
        });
        setData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {data && (
        <>
          <h1 className="title">Historical data retrieved successfully</h1>
          <div className="grid">
            {data.body.data.map((datum, i) => (
              <div
                className={
                  datum.quote.USD.percent_change_1h > 0
                    ? "card" // Add the card class
                    : "card negative"
                }
              >
                <span className="coinSym">{datum.symbol}</span>{" "}
                <span className="coinNum">{datum.name}</span>
                <ul className="coinPercent_list">
                  <li>
                    percent_change_1h: ${datum.quote.USD.percent_change_1h}
                  </li>
                  <li>
                    percent_change_24hr: ${datum.quote.USD.percent_change_24h}
                  </li>
                  <li>
                    percent_change_7d: ${datum.quote.USD.percent_change_7d}
                  </li>
                  <li>
                    percent_change_30d: {""}$
                    {datum.quote.USD.percent_change_30d}
                  </li>
                  <li>
                    percent_change_60d: ${datum.quote.USD.percent_change_60d}
                  </li>
                  <li>
                    percent_change_90d: ${datum.quote.USD.percent_change_90d}
                  </li>
                </ul>
                <br />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CoinData;
