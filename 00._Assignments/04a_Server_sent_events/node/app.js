const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080;

const API_KEY = 'B75KE5NMO1RMF35R';
const SYMBOL = 'IBM'; 
const cors = require('cors');

app.use(express.static('public'));
app.use(cors());


app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const fetchStockPrice = async () => {
        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${SYMBOL}&apikey=${API_KEY}`);
            console.log(response.data);

            const globalQuote = response.data['Global Quote'];
        
            const stockInfo = {
                symbol: SYMBOL,
                open: globalQuote['02. open'],
                high: globalQuote['03. high'],
                low: globalQuote['04. low'],
                price: globalQuote['05. price'],
                volume: globalQuote['06. volume'],
                latestTradingDay: globalQuote['07. latest trading day'],
                previousClose: globalQuote['08. previous close'],
                change: globalQuote['09. change'],
                changePercent: globalQuote['10. change percent']
            };

            console.log(stockInfo);
      
            res.write(`data: ${JSON.stringify(stockInfo)}\n\n`);
        } catch (error) {
            console.error('Error fetching stock price:', error);
        }
        
    };

    const intervalId = setInterval(() => {
        fetchStockPrice();
    }, 10000); // Update every 10 seconds

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
});

app.listen(PORT, () => {
    console.log(`SSE server running on http://localhost:${PORT}`);
});
