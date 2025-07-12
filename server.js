const express = require('express');
const crypto = require('crypto');
const app = express();

const API_KEY = 'bb1d18c432408a44293c22e6c0eb1bcece354e3a21772181b23569590dc4daad';
const API_SECRET = '99cfd13bb9a4d2263f3ac520964108370c5f586e7283472d13306b9f39786fa96eca40d41c62410bc46a2abd816f89a76ee31aba881f9164d3ca3716f41902e9';

app.use(express.json());

app.post('/sign', (req, res) => {
  const { method, endpoint, body } = req.body;

  const timestamp = Date.now().toString();
  const windowMs = '10000';
  const prehash = timestamp + method + endpoint + body;

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(prehash)
    .digest('hex');

  res.json({
    apiKey,
    signature,
    timestamp,
    windowMs,
    endpoint: `https://api.bitvavo.com${endpoint}`
  });
});

// ✅ This is critical
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Bitvavo signer running on port ${PORT}`);
});
