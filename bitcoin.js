const fetch = require('node-fetch');
require('dotenv').config();
const lightItUp = require('./lights').default;

const run = async () => {
  // check if btc is up or down
  let marketData;
  let btcValue;
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
    btcValue = marketData.data.BTC.quote.USD.percent_change_1h;
    console.log(`BTC percent change 1hr: ${btcValue}`);
  } catch (error) {
    throw new Error(`could not get market data: ${error}`);
  }

  // light it up on the condition BTC is up or down
  lightItUp(btcValue > 0);
};

run();
