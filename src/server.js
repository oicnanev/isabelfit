const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const smtpUser = process.env.ELASTIC_EMAIL_USER;
const smtpPass = process.env.ELASTIC_EMAIL_API_KEY;
const hasSmtpCredentials = Boolean(smtpUser && smtpPass);

let transporter = null;

if (hasSmtpCredentials) {
  transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.verify((error) => {
    if (error) {
      console.error('Erro na conexão SMTP:', error);
    } else {
      console.log('Conexão SMTP configurada com sucesso');
    }
  });
} else {
  console.warn('Credenciais SMTP faltando. Defina ELASTIC_EMAIL_USER e ELASTIC_EMAIL_API_KEY no ficheiro .env para ativar o envio de emails.');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (!transporter) {
    return res.status(503).json({
      error: 'Email não configurado.',
      details: 'Adiciona ELASTIC_EMAIL_USER e ELASTIC_EMAIL_API_KEY ao ficheiro .env para ativar o envio de mensagens.'
    });
  }

  const mailOptions = {
    from: '"IsabelFit" <isabel@isabelfit.pt>',
    to: 'isabel@isabelfit.pt',
    subject: `Novo contacto - ${name}`,
    html: `
      <h3>Novo contacto do site</h3>
      <p><strong>De:</strong> ${name} (${email})</p>
      <p>${message}</p>
    `,
    text: `Mensagem de ${name} (${email}): ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', {
      error: error.message,
      stack: error.stack,
      response: error.response
    });

    res.status(500).json({
      error: 'Falha ao enviar mensagem',
      details: error.response || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
