const eventSource = new EventSource('/events');
const stocksElement = document.getElementById('stocks');

eventSource.onmessage = function(event) {
    const stocks = JSON.parse(event.data);
    console.log(stocks);


    stocksElement.innerHTML = ''; 

    for (const [stock, price] of Object.entries(stocks)) {
        const stockElement = document.createElement('div');
        stockElement.textContent = `${stock}: $${price}`;
        stocksElement.appendChild(stockElement);
    }
};

eventSource.onerror = function(error) {
    console.error('EventSource failed:', error);
    eventSource.close();
};
