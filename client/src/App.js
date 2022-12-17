import React from "react";
import CoinData from "./coinData/coinData";
import CoinBot from "./coinBot/coinBot";

const App = () => {
  return (
    <div className="app-container">
      <CoinBot />
      <CoinData />
    </div>
  );
};

export default App;
