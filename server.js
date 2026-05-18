// Servidor - Landing Curso Laura Rincon Nails
// MailerLite + Quiz precalificador + Payment Link externo

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.MAILERLITE_API_KEY) {
  console.warn('Falta MAILERLITE_API_KEY. Configuralo en los Secrets de Replit.');
}

const CURSO_NOMBRE = process.env.CURSO_NOMBRE || 'Curso Profesional de Unas con Laura Rincon';
const CURSO_PRECIO_USD = parseFloat(process.env.CURSO_PRECIO_USD || '97');
const PAYMENT_LINK = process.env.PAYMENT_LINK || 'https://tools.marcelocrm.com/payment-link/69d6b5bdc6a0e600f4d08674';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/config', (req, res) => {
  res.json({
    precio: CURSO_PRECIO_USD,
    nombre: CURSO_NOMBRE,
    paymentLink: PAYMENT_LINK
  });
});

app.post('/api/quiz-submit', async (req, res) => {
  try {
    const { nombre, email, nivel, score, answers } = req.body;
    if (!email || !nombre) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    await upsertMailerLiteSubscriber({
      email,
      nombre,
      groupId: process.env.MAILERLITE_GROUP_ID,
      fields: {
        nivel_quiz: nivel || '',
        score_quiz: String(score == null ? '' : score),
        respuestas_quiz: JSON.stringify(answers || {}),
        fecha_quiz: new Date().toISOString().slice(0, 10)
      }
    });
    console.log('Nuevo lead del quiz: ' + email + ' (' + nivel + ', score ' + score + ')');
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en /api/quiz-submit:', err.message);
    res.status(500).json({ error: 'No se pudo guardar el lead' });
  }
});

app.post('/api/track-checkout-click', async (req, res) => {
  try {
    const { email, nombre, nivel } = req.body || {};
    if (!email) return res.json({ ok: true });
    await upsertMailerLiteSubscriber({
      email,
      nombre: nombre || '',
      groupId: process.env.MAILERLITE_GROUP_ID,
      fields: {
        clic_compra: 'si',
        fecha_clic_compra: new Date().toISOString().slice(0, 10),
        nivel_quiz: nivel || ''
      }
    });
    console.log('Clic en comprar de: ' + email + ' (' + nivel + ')');
    res.json({ ok: true });
  } catch (err) {
    console.error('Error en /api/track-checkout-click:', err.message);
    res.json({ ok: false });
  }
});

async function upsertMailerLiteSubscriber({ email, nombre, groupId, fields }) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.warn('MAILERLITE_API_KEY no configurada, saltando guardado');
    return;
  }
  const payload = {
    email: email,
    fields: Object.assign({ name: nombre || '' }, fields || {}),
    status: 'active'
  };
  if (groupId) payload.groups = [groupId];
  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error('MailerLite error ' + response.status + ': ' + text);
  }
  return response.json();
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mailerlite: !!process.env.MAILERLITE_API_KEY,
    paymentLink: PAYMENT_LINK
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor corriendo en http://0.0.0.0:' + PORT);
  console.log('Landing del curso de Laura Rincon Nails lista');
  console.log('MailerLite: ' + (process.env.MAILERLITE_API_KEY ? 'configurado' : 'NO configurado'));
  console.log('Payment Link: ' + PAYMENT_LINK);
});