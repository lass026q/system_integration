const eventSource = new EventSource('/events');
const stocksElement = document.getElementById('stocks');

eventSource.onmessage = function(event) {
    const stockInfo = JSON.parse(event.data);

    const stockDiv = document.createElement('div');
    stockDiv.innerHTML = `
        <strong>Symbol:</strong> ${stockInfo.symbol}<br>
        <strong>Open:</strong> ${stockInfo.open}<br>
        <strong>High:</strong> ${stockInfo.high}<br>
        <strong>Low:</strong> ${stockInfo.low}<br>
        <strong>Price:</strong> ${stockInfo.price}<br>
        <strong>Volume:</strong> ${stockInfo.volume}<br>
        <strong>Latest Trading Day:</strong> ${stockInfo.latestTradingDay}<br>
        <strong>Previous Close:</strong> ${stockInfo.previousClose}<br>
        <strong>Change:</strong> ${stockInfo.change}<br>
        <strong>Change Percent:</strong> ${stockInfo.changePercent}
    `;

    stocksElement.innerHTML = '';
    stocksElement.appendChild(stockDiv);
};

eventSource.onerror = function(error) {
    console.error('EventSource failed:', error);
    eventSource.close();
};
