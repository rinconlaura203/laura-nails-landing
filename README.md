# 💅 Curso Profesional de Uñas — Landing de Laura Rincón

Landing page de ventas con quiz precalificador de 5 preguntas, pasarela de pago Stripe y CRM MailerLite.

---

## 📂 Estructura de archivos

```
/
├── server.js              ← Backend Node.js + Express
├── package.json           ← Dependencias
├── .replit                ← Configuración de Replit
├── replit.nix             ← Nix (Node 20)
├── .env.example           ← Plantilla de variables (copiar a Secrets)
├── README.md              ← Este archivo
└── public/
    ├── index.html         ← Landing + quiz
    └── exito.html         ← Página post-pago
```

---

## 🚀 Cómo subirlo a Replit (paso a paso)

### 1. Crear el Repl
1. Entra a https://replit.com y haz clic en **Create Repl**.
2. Elige plantilla **Node.js** y dale un nombre (ej. `laura-nails-landing`).
3. Una vez dentro, **borra** el `index.js` por defecto.

### 2. Subir los archivos
1. Arrastra todos los archivos de esta carpeta al panel izquierdo de Replit.
2. Asegúrate de mantener la subcarpeta `public/` con `index.html` y `exito.html` dentro.
3. Replit detectará el `package.json` y te ofrecerá instalar dependencias — acepta.

### 3. Instalar dependencias (si no se hace solo)
En la shell de Replit ejecuta:
```bash
npm install
```

### 4. Probar localmente
Haz clic en el botón verde **Run**. Si ves `🚀 Servidor corriendo` en la consola, la landing ya está accesible en la ventana web de Replit.

---

## 🔑 Configurar MailerLite (desde cero, es gratis)

### Paso 1: Crear cuenta
1. Ve a https://www.mailerlite.com y haz clic en **Sign up free**.
2. Confirma tu email y completa el onboarding (puedes saltar la creación de campañas).

### Paso 2: Crear los grupos (segmentos)
1. En el menú lateral entra a **Subscribers → Groups**.
2. Crea dos grupos:
   - **Leads Quiz** → aquí entrarán todas las personas que terminen el quiz.
   - **Compradoras Curso** → aquí caerán quienes paguen (gracias al webhook de Stripe).
3. Haz clic en cada grupo y copia el **ID del grupo** que aparece en la URL (algo como `123456789`).

### Paso 3: Obtener la API Key
1. Ve a **Integrations → Developer API** (o directo: https://dashboard.mailerlite.com/integrations/api).
2. Si no tienes API token, haz clic en **Generate new token**.
3. Dale un nombre (ej. `Landing Curso`) y copia el token. **Guárdalo bien, solo se ve una vez.**

### Paso 4: Crear campos personalizados (recomendado)
En **Subscribers → Fields** crea estos campos tipo texto:
- `nivel_quiz` (text)
- `score_quiz` (text)
- `respuestas_quiz` (text)
- `fecha_quiz` (text)
- `comprador` (text)
- `fecha_compra` (text)

Si no los creas, MailerLite los creará automáticamente al recibir el primer lead.

---

## 💳 Configurar Stripe

### Paso 1: Crear cuenta
1. Entra a https://dashboard.stripe.com/register
2. Completa los datos del negocio (puedes empezar en **modo de prueba** sin verificar).

### Paso 2: Obtener las llaves
1. Ve a https://dashboard.stripe.com/apikeys
2. Copia la **Secret key** (`sk_test_...` para pruebas, `sk_live_...` para producción).
3. Copia también la **Publishable key** (`pk_test_...`).

### Paso 3 (opcional pero recomendado): Webhook
Para que MailerLite mueva automáticamente al grupo de compradoras cuando alguien pague:
1. Ve a https://dashboard.stripe.com/webhooks → **Add endpoint**.
2. URL: `https://TU-PROYECTO.replit.app/api/stripe-webhook`
3. Evento a escuchar: `checkout.session.completed`
4. Copia el **Signing secret** (`whsec_...`) y guárdalo.

---

## 🔐 Configurar los Secrets en Replit

En Replit, ve al icono del candado 🔒 (**Secrets** o **Tools → Secrets**) y añade estos:

| Key | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_test_...` o `sk_live_...` |
| `STRIPE_PUBLIC_KEY` | `pk_test_...` o `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (opcional, si configuraste el webhook) |
| `MAILERLITE_API_KEY` | tu token de MailerLite |
| `MAILERLITE_GROUP_ID` | ID del grupo "Leads Quiz" |
| `MAILERLITE_BUYERS_GROUP_ID` | ID del grupo "Compradoras Curso" (opcional) |
| `CURSO_NOMBRE` | `Curso Profesional de Uñas con Laura Rincón` |
| `CURSO_PRECIO_USD` | `97` (o el precio que prefieras) |
| `CURSO_DESCRIPCION` | descripción corta del curso |
| `SUCCESS_URL` | `https://TU-PROYECTO.replit.app/exito.html` |
| `CANCEL_URL` | `https://TU-PROYECTO.replit.app/` |

Después de añadir los secrets, **haz clic en Stop y luego Run** para reiniciar el servidor.

---

## 🎨 Personalizar la landing

Todo lo que probablemente quieras cambiar está en estos lugares:

### Precio del curso
Cambia `CURSO_PRECIO_USD` en los Secrets de Replit. El precio se actualiza solo en la página y en Stripe.

### Textos y descripción
Edita `public/index.html`. Las secciones están claramente comentadas: HERO, BENEFICIOS, MÓDULOS, INSTRUCTORA, QUIZ, RESULTADO.

### Colores de marca
Al inicio del `<style>` en `index.html`, hay variables CSS:
```css
--rosa-suave: #fce8ec;
--rosa-medio: #f4a8b8;
--rosa-fuerte: #d77a8a;
--dorado: #c9a96e;
```
Cámbialas para ajustar la paleta a tu gusto.

### Foto de la instructora
Reemplaza el `<div class="instructor-img">LR</div>` por una `<img>` real:
```html
<img class="instructor-img" src="tu-foto.jpg" alt="Laura Rincón" />
```
Y sube la foto a la carpeta `public/`.

### Preguntas del quiz
Cada pregunta está dentro de un `<div class="quiz-step" data-step="N">`. Los `data-value` (0–3) son los puntos que suma cada respuesta. La lógica de scoring está al final del HTML:
- **0–4 puntos** → Principiante
- **5–9 puntos** → Intermedia
- **10–15 puntos** → Avanzada

---

## 🧪 Probar todo de punta a punta

1. Con todos los secrets configurados y el servidor corriendo, abre tu URL `.replit.app`.
2. Haz el quiz completo con un email tuyo (de prueba).
3. Revisa que el lead aparezca en MailerLite → grupo "Leads Quiz".
4. Haz clic en "Comprar ahora" y usa la **tarjeta de prueba de Stripe**: `4242 4242 4242 4242`, cualquier fecha futura, cualquier CVC.
5. Tras pagar, deberías llegar a `/exito.html` y (si el webhook está activo) el lead se moverá al grupo "Compradoras Curso".

---

## ⚠️ Cuando estés lista para vender de verdad

1. Cambia `sk_test_...` y `pk_test_...` por las llaves **live** de Stripe.
2. Activa tu cuenta de Stripe (verificación de identidad y datos bancarios).
3. Actualiza la URL del webhook a la de producción.
4. Considera comprar un dominio personalizado y conectarlo a Replit (Settings → Custom Domain).

---

## ❓ Problemas frecuentes

**El quiz no guarda el lead.** Revisa la consola del navegador (F12) y la consola de Replit. Lo más común es que falte `MAILERLITE_API_KEY` o `MAILERLITE_GROUP_ID`.

**Stripe da error al pagar.** Verifica que `STRIPE_SECRET_KEY` esté en los Secrets y que reiniciaste el Repl después de añadirla.

**El webhook no funciona.** Asegúrate de que la URL pública sea accesible y que el `STRIPE_WEBHOOK_SECRET` sea exactamente el `whsec_...` del endpoint que creaste.

---

Cualquier duda, escríbeme por Instagram: [@laurarincon_nails](https://www.instagram.com/laurarincon_nails) 💕
