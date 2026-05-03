export default async function handler(req, res) {
  // Validate HTTP method - POST only
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate secret token from environment
  const NOTIFY_TOKEN = process.env.NOTIFY_TOKEN;
  if (!NOTIFY_TOKEN) {
    console.error('NOTIFY_TOKEN not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // Check authorization header for secret token
  const authHeader = req.headers['authorization'] || req.headers['x-notify-token'];
  if (!authHeader || authHeader !== `Bearer ${NOTIFY_TOKEN}`) {
    console.warn('Unauthorized access attempt to notify endpoint');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validate Telegram token is configured
  const TG_TOKEN = process.env.TG_TOKEN;
  if (!TG_TOKEN) {
    console.error('TG_TOKEN not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // Get and validate chat IDs from environment or use fallback
  const chatIdsEnv = process.env.TELEGRAM_CHAT_IDS;
  const chatIds = chatIdsEnv ? chatIdsEnv.split(',').map(id => id.trim()) : ['8791111721', '5106987392'];

  // Validate request body exists
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const agend = req.body;

  // Validate required fields
  const requiredFields = ['nome', 'proc', 'data', 'hora'];
  const missingFields = requiredFields.filter(field => !agend[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      missing: missingFields
    });
  }

  // Validate data format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(agend.data)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  // Validate time format (HH:MM)
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(agend.hora)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
  }

  // Sanitize inputs - limit string lengths
  const sanitize = (str, maxLength = 100) => {
    if (typeof str !== 'string') return '';
    return str.substring(0, maxLength).replace(/[<>]/g, '');
  };

  const sanitizedAgend = {
    nome: sanitize(agend.nome, 50),
    proc: sanitize(agend.proc, 100),
    data: agend.data,
    hora: agend.hora,
    tel: agend.tel ? sanitize(agend.tel, 20) : '',
    obs: agend.obs ? sanitize(agend.obs, 200) : ''
  };

  const [y, m, d] = sanitizedAgend.data.split('-');

  const msg = `🌸 Novo Agendamento!\n\n👤 Cliente: ${sanitizedAgend.nome}\n💅 Serviço: ${sanitizedAgend.proc}\n📅 Data: ${d}/${m}/${y}\n🕐 Horário: ${sanitizedAgend.hora}${sanitizedAgend.tel ? '\n📱 WhatsApp: ' + sanitizedAgend.tel : ''}${sanitizedAgend.obs ? '\n📝 Obs: ' + sanitizedAgend.obs : ''}`;

  const errors = [];
  for (const chatId of chatIds) {
    try {
      const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg })
      });
      const data = await resp.json().catch(() => ({}));
      console.log(`Telegram ${chatId}:`, resp.status, data);
      if (!resp.ok) errors.push(`${chatId}: ${data.description || resp.status}`);
    } catch (e) {
      console.error(`Telegram err ${chatId}:`, e);
      errors.push(`${chatId}: ${e.message}`);
    }
  }

  if (errors.length === chatIds.length) {
    return res.status(502).json({ error: 'Failed to send notifications', details: errors });
  }

  return res.status(200).json({ ok: true, sent: chatIds.length - errors.length });
}
