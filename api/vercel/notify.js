export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const agend = req.body;
  if (!agend || !agend.nome || !agend.data || !agend.hora) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const [y, m, d] = agend.data.split('-');
  const msg = `🌸 Novo Agendamento!\n\n👤 Cliente: ${agend.nome}\n💅 Serviço: ${agend.proc || 'Nao informado'}\n📅 Data: ${d}/${m}/${y}\n🕐 Horário: ${agend.hora}${agend.tel ? '\n📱 WhatsApp: ' + agend.tel : ''}`;

  const errors = [];
  const sent = [];

  // Telegram (if configured)
  const TG_TOKEN = process.env.TG_TOKEN;
  if (TG_TOKEN) {
    const chatIds = (process.env.TELEGRAM_CHAT_IDS || '8791111721,5106987392').split(',').map(id => id.trim());
    for (const chatId of chatIds) {
      try {
        const resp = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: msg })
        });
        if (resp.ok) sent.push(`Telegram ${chatId}`);
        else errors.push(`Telegram ${chatId}: ${resp.status}`);
      } catch(e) { errors.push(`Telegram ${chatId}: ${e.message}`); }
    }
  }

  // WhatsApp via CallMeBot (if configured)
  const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE;
  const WHATSAPP_APIKEY = process.env.WHATSAPP_APIKEY;
  if (WHATSAPP_PHONE && WHATSAPP_APIKEY) {
    try {
      const resp = await fetch(`https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}&apikey=${WHATSAPP_APIKEY}`);
      if (resp.ok) sent.push('WhatsApp');
      else errors.push(`WhatsApp: ${resp.status}`);
    } catch(e) { errors.push(`WhatsApp: ${e.message}`); }
  }

  return res.status(200).json({ ok: true, sent, errors: errors.length ? errors : undefined });
}
