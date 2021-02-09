const fetch = require('node-fetch');
require('dotenv').config();

const convertHSL = (color) => {
  const { h, s, l } = color;
  return {
    hue: Math.floor((65535 * h) / 360),
    sat: Math.floor(s * 255),
    bri: Math.floor(l * 255),
  };
};

// le colors of the lights
const green = convertHSL({
  h: 109,
  s: 0.7,
  l: 0.7,
});
const red = convertHSL({
  h: 345,
  l: 0.48,
  s: 0.82,
});

const lights = [1, 2];

const run = async () => {
  // check if btc is up or down
  let marketData;
  let btcUp;
  try {
    const marketDataResponse = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC',
      {
        method: 'GET',
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_CAP_KEY,
        },
      }
    );
    marketData = await marketDataResponse.json();
    btcUp = marketData.data.BTC.quote.USD.percent_change_1h;
  } catch (error) {
    throw new Error(`could not get market data: ${error}`);
  }

  // base object for each light
  let body = {
    on: true,
  };
  if (btcUp) {
    body = { ...body, ...green };
  } else {
    body = { ...body, ...red };
  }

  try {
    for (const light of lights) {
      fetch(
        `http://192.168.2.111/api/${process.env.HUE_APP_KEY}/lights/${light}/state`,
        {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    throw new Error(`could not set the lights: ${error}`);
  }
};

run();
