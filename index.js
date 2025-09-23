const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const urls = (process.env.RENDER_APP_URL || "")
  .split(",")
  .map(u => u.trim())
  .filter(u => u.length > 0);

if (urls.length === 0) {
  console.error("Error: No URLs provided in RENDER_APP_URL");
  process.exit(1);
}

app.get('/', (req, res) => {
  res.json({
    message: "Ping service running",
    urls
  });
});

async function pingUrls() {
  for (const url of urls) {
    try {
      const resp = await fetch(url);
      console.log(`[${new Date().toISOString()}] Pinged ${url}, status: ${resp.status}`);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Error pinging ${url}: ${err.message}`);
    }
  }
}

setInterval(pingUrls, 30 * 1000);
pingUrls();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
