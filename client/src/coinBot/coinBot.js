/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import "./styles.css";

const CoinBot = () => {
  const [coins, setCoins] = useState(null);
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/latestCoins", {
          params: {
            id: 1,
            time_start: "2022-01-01",
            time_end: "2022-12-31",
            interval: "1d",
          },
        });
        setCoins(res.data.body);
      } catch (err) {
        console.error(err.message);
        setCoins(null);
      }
    };
    fetchData();
  }, []);

  const intervals = [30 * 60 * 1000];
  console.log(intervals);

  // Use TensorFlow.js to make predictions on coin prices
  useEffect(() => {
    const makePredictions = async () => {
      if (coins) {
        // Create an array of coin prices
        const coinPrices = coins.data.map((coin) => coin.quote.USD.price);

        // Use TensorFlow.js to create a model and make predictions
        const model = tf.sequential();

        // Add three hidden layers with 32, 64, and 128 neurons respectively
        // Add regularization to the layers of the model
        model.add(
          tf.layers.dense({
            units: 64,
            inputShape: [1],
            activation: "relu",
            kernelRegularizer: tf.regularizers.l1(),
          })
        );
        model.add(
          tf.layers.dense({
            units: 128,
            activation: "relu",
            kernelRegularizer: tf.regularizers.l2(),
          })
        );
        model.add(
          tf.layers.dense({
            units: 256,
            activation: "relu",
            kernelRegularizer: tf.regularizers.l1(),
          })
        );

        // Add an output layer with a single neuron
        model.add(tf.layers.dense({ units: 1 }));

        // Compile the model using the Adam optimizer and mean squared error loss
        model.compile({ optimizer: "adam", loss: "meanSquaredError" });

        const expectedPrices = [];

        // Calculate the change in price between consecutive time points
        for (let i = 1; i < coinPrices.length; i++) {
          expectedPrices.push(coinPrices[i] - coinPrices[i - 1]);
        }

        const trainXs = tf.tensor1d(coinPrices.slice(0, -1));
        const trainYs = tf.tensor1d(expectedPrices);

        await model.fit(trainXs, trainYs, {
          epochs: 2000,
          batchSize: 256,
          validationSplit: 0.2,
        });

        // Make predictions for each interval
        const preds = [];
        intervals.forEach((interval) => {
          const predXs = tf.tensor1d(coinPrices.slice(-interval));
          const predYs = model.predict(predXs);
          preds.push(predYs.dataSync());
        });

        // Store the predictions in the component state
        setPredictions(preds);
      }
    };

    makePredictions();
  }, [coins]);

  return (
    <div className="container">
      {coins ? (
        <>
          {coins.data.map((coin, index) => (
            <>
              <span className="coinS">{coin.symbol}</span>
              <ul className="coinList" key={index}>
                <li>
                  coin max supply:{" "}
                  {!coin.max_supply ? "none available" : coin.max_supply}
                </li>
                <li>circulating supply : {coin.circulating_supply}</li>
                <li>total supply : {coin.total_supply}</li>
                <li>coin ranking: {coin.cmc_rank}.</li>
                <li>coin name: {coin.name}:</li>
                <li>coin current price :${coin.quote.USD.price}</li>
                {predictions && predictions.length === coins.data.length && (
                  <>
                    <br />
                    <span className="title_aI">AI GENERATED</span>
                    <li>
                      predicted price in 30 minutes: ${predictions[index][0]}
                    </li>
                  </>
                )}
              </ul>
            </>
          ))}
        </>
      ) : (
        <div className="loading-circle" />
      )}
    </div>
  );
};

export default CoinBot;
