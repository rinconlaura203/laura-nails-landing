// Servidor - Landing Curso Laura Rincon Nails
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

const ML_KEY = process.env.MAILERLITE_API_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYzE2NmNhMWMyMThiOTBhMDcyMzZiYTlkNTFkYjViYzJiNDY5NzU4N2M0MTE3MGY0MGQ3YWZkYThhODZiMzEyOWJlNDdiNjY0OGY3MGM5MzkiLCJpYXQiOjE3NzkzMjQ4OTQuNDM3NjY1LCJuYmYiOjE3NzkzMjQ4OTQuNDM3NjY3LCJleHAiOjQ5MzQ5OTg0OTQuNDMzNTQyLCJzdWIiOiIyMzcyODEyIiwic2NvcGVzIjpbXX0.dW62BeRIsRglLn3rcCGlIdFKtkJ2mn7EpqGNX_bYYGjGjWGExCUqzn71gaZux7D2mr2PkILl1QjutpzJpafKKS1tI5qIRq8lfoQ8ecXYQI4LQrLZYPys-fLWUcgg4keUP-Y37Uqo8HZa3Xpahma7wweSz3phmmjIQ-uBXAbQ50kB9gG-qjB5DOmSgZHMISintvgfQywKhnK-eUlaZAlNRVYSlyEgt_fUBN0wsGvSKK4OLFPToNPnKwaGKBfkjvh0Was5HZfpLJk8BpxS2yf4kL2pE9PYmjzxBQ5upuaA5FLM-BHB46edhY_9m_0zUrP5C0neLBTVxZ1JXUveVI6S96-B06EHxg67OR27fZllBow56Xw9euhS1MP1dqausJ_klyEOK5qz03kvTl_NKj74lCPGol4YSP7E6ovfCCj6I94JgrlgN-Jb6CgK_zKykBTQZtHszkGQNTFH8nxLqWwFivkREF9jD38pjjzs1Ta0msT6z6Z7v4y5B6pD3Js6C9qM1sorQ__NPM7NVR9HP_ZiWS1YsMyuFK0pqmFyCPWIC0wjUImTFAV_JbwsySFxCxr0jKzhM08k1JrUyllS2ULx9ZLxx3g5cbtp6Z3Nam7OpqNR7JbNmJ1Htd8wGPi0fACJwm7VUrfZisy_RWtjZSs2VORKbydmdaTiODVGSKVtHDY';
const ML_GROUP = process.env.MAILERLITE_GROUP_ID || '187656115644794017';
const SESS_SECRET = process.env.SESSION_SECRET || 'laurarinconnails2026secretkey!';

app.use(cors({
  origin: ['https://laurarinconnails.com', 'https://www.laurarinconnails.com', 'https://laura-nails-landing.onrender.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: SESS_SECRET, resave: false, saveUninitialized: false, cookie: { secure: process.env.NODE_ENV === 'production' } }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/subscribe', async (req, res) => {
  const { name, email, phone, experience } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requerido' });
  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ML_KEY}` },
      body: JSON.stringify({ email, fields: { name: name || '', phone: phone || '', experience: experience || '' }, groups: [ML_GROUP], status: 'active' })
    });
    const data = await response.json();
    if (response.ok || response.status === 422) {
      res.json({ success: true, message: 'Registrada exitosamente' });
    } else {
      res.status(500).json({ error: 'Error MailerLite', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error interno', details: err.message });
  }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log('Puerto ' + PORT));
