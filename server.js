const express = require('express');
const crypto = require('crypto');
const app = express();

// 🔐 Bitvavo API credentials
const API_KEY = 'bb1d18c432408a44293c22e6c0eb1bcece354e3a21772181b23569590dc4daad';
const API_SECRET = '99cfd13bb9a4d2263f3ac520964108370c5f586e7283472d13306b9f39786fa96eca40d41c62410bc46a2abd816f89a76ee31aba881f9164d3ca3716f41902e9';

// Middleware to parse JSON requests
app.use(express.json());

// ✍️ Sign Bitvavo API requests
app.post('/sign', (req, res) => {
  try {
    const { method, endpoint, body } = req.body;

    if (!method || !endpoint) {
      throw new Error("Missing required fields: method or endpoint");
    }

    const timestamp = Date.now().toString();
    const windowMs = '30000';
    const prehash = timestamp + method + endpoint + body;

    const signature = crypto
      .createHmac('sha256', API_SECRET)
      .update(prehash)
      .digest('hex');

    res.json({
      apiKey: API_KEY,
      signature,
      timestamp,
      windowMs,
      endpoint: `https://api.bitvavo.com${endpoint}`
    });

  } catch (error) {
    console.error("Signing error:", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// ✅ This is critical
const PORT = process.env.PORT || 30000;
app.listen(PORT, () => {
  console.log(`Bitvavo signer running on port ${PORT}`);
});

