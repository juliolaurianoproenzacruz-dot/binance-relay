const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Binance Relay Online');
});

const wss = new WebSocket.Server({ server });

function startBinance() {
  const binance = new WebSocket('wss://fstream.binance.com/ws/btcusdt@aggTrade');

  binance.on('open', () => console.log('Conectado a Binance Futuros'));

  binance.on('message', (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  binance.on('close', () => setTimeout(startBinance, 500));
  binance.on('error', () => binance.close());
}

startBinance();

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Escuchando en ${PORT}`));
