export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const TG_TOKEN = process.env.TG_TOKEN;
  if (!TG_TOKEN) {
    console.error('TG_TOKEN not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const chatIds = ['8791111721', '5106987392'];

  const agend = req.body;
  const [y, m, d] = (agend.data || '').split('-');

  const msg = `🌸 Novo Agendamento!\n\n👤 Cliente: ${agend.nome || ''}\n💅 Serviço: ${agend.proc || ''}\n📅 Data: ${d}/${m}/${y}\n🕐 Horário: ${agend.hora || ''}${agend.tel ? '\n📱 WhatsApp: ' + agend.tel : ''}${agend.obs ? '\n📝 Obs: ' + agend.obs : ''}`;

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
