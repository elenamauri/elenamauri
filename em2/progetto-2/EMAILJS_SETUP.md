# Guida Configurazione EmailJS

## Passo 1: Registrazione e Setup Iniziale

1. Vai su https://www.emailjs.com e crea un account gratuito
2. Dopo il login, vai su **Account** → **General** e copia la tua **Public Key**

## Passo 2: Configurare Email Service

1. Vai su **Email Services** nel menu
2. Clicca **Add New Service**
3. Scegli il tuo provider email (Gmail, Outlook, ecc.)
4. Segui le istruzioni per connettere il tuo account email
5. Copia il **Service ID** che viene generato

## Passo 3: Creare Template per Richiesta Password (a te)

1. Vai su **Email Templates** → **Create New Template**
2. Nome template: `password_request` (o come preferisci)
3. Configura il template così:

**Subject:**
```
Password Request - Progetto 2
```

**Content (HTML):**
```html
<h2>New Password Request</h2>
<p>You have received a password request for Progetto 2:</p>
<ul>
  <li><strong>Name:</strong> {{requester_name}}</li>
  <li><strong>Email:</strong> {{requester_email}}</li>
  <li><strong>Company:</strong> {{requester_company}}</li>
  <li><strong>Date:</strong> {{request_date}}</li>
</ul>
<p>Click the button below to approve and automatically send the password:</p>
<p style="margin: 30px 0;">
  <a href="{{approve_url}}" style="background-color: #0059e7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Approve</a>
</p>
<p style="color: #666; font-size: 12px;">This link will expire in 7 days.</p>
```

4. **To Email:** `elenamauri32@gmail.com`
5. **From Name:** `Portfolio System`
6. **Reply To:** `{{requester_email}}`
7. Salva e copia il **Template ID**

## Passo 4: Creare Template per Invio Password (all'utente)

1. Vai su **Email Templates** → **Create New Template**
2. Nome template: `password_send` (o come preferisci)
3. Configura il template così:

**Subject:**
```
Password for Progetto 2 - EM Portfolio
```

**Content (HTML):**
```html
<h2>Password Approved</h2>
<p>Hi {{to_name}},</p>
<p>Your password request for <strong>{{project_name}}</strong> has been approved.</p>
<p>Here is your password:</p>
<div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0; font-family: monospace; font-size: 18px; text-align: center;">
  <strong>{{password}}</strong>
</div>
<p>You can now access the project at:</p>
<p><a href="{{login_url}}">{{login_url}}</a></p>
<p>Best regards,<br>Elena Mauri</p>
```

4. **To Email:** `{{to_email}}`
5. **From Name:** `Elena Mauri`
6. **Reply To:** `elenamauri32@gmail.com`
7. Salva e copia il **Template ID**

## Passo 5: Inserire le Chiavi nel Codice

### In `login.html` (righe ~341-343):
```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Sostituisci
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Sostituisci
const EMAILJS_TEMPLATE_REQUEST = 'YOUR_TEMPLATE_REQUEST_ID'; // Sostituisci con Template ID del passo 3
```

### In `approve.html` (righe ~20-23):
```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Sostituisci (stesso della login.html)
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Sostituisci (stesso della login.html)
const EMAILJS_TEMPLATE_PASSWORD = 'YOUR_TEMPLATE_PASSWORD_ID'; // Sostituisci con Template ID del passo 4
```

## Passo 6: Test

1. Apri `login.html` nel browser
2. Clicca "Don't have the password? Ask me"
3. Compila il form e invia
4. Controlla la tua email (elenamauri32@gmail.com)
5. Clicca il pulsante "Approve" nella mail
6. Verifica che l'utente riceva la password

## Note Importanti

- Il piano gratuito di EmailJS permette 200 email/mese
- I template supportano variabili con doppie parentesi graffe: `{{variable_name}}`
- Il link di approvazione scade dopo 7 giorni per sicurezza
- Assicurati che la password in `CORRECT_PASSWORD` sia la stessa in tutti i file

## Troubleshooting

- Se le email non arrivano, controlla la cartella spam
- Verifica che tutti gli ID siano corretti nel codice
- Controlla la console del browser per eventuali errori
- Assicurati che il servizio email sia attivo su EmailJS

