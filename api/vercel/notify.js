const { v4: uuidv4 } = require('uuid');

// Vercel serverless function for sending WhatsApp notification via CallMeBot
module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const agend = req.body;

    // Validate required fields
    if (!agend || !agend.nome || !agend.data || !agend.hora || !agend.proc) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get environment variables (set in Vercel dashboard)
    const whatsappPhone = process.env.WHATSAPP_PHONE;
    const whatsappApiKey = process.env.WHATSAPP_APIKEY;

    if (!whatsappPhone || !whatsappApiKey) {
      console.error('WhatsApp environment variables not configured');
      // Still return success to not break UI, but log error
      return res.status(200).json({ 
        success: true, 
        notification: 'skipped (missing config)', 
        warning: 'WhatsApp not configured' 
      });
    }

    // Format message for WhatsApp
    const dataStr = agend.data || '';
    const [y, m, d] = dataStr.split('-');
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                   'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const dataFmt = (d && m) ? (d + ' de ' + meses[parseInt(m)-1]) : 'Data inválida';
    const horaFmt = agend.hora || 'Não informado';
    const procFmt = agend.proc || 'Não informado';
    const nomeFmt = agend.nome || 'Cliente';
    const telFmt = agend.tel || 'Não informado';

    const message = `
🎉 *Novo Agendamento Recebido*

👧 *Nome:* ${nomeFmt}
📅 *Data:* ${dataFmt}
🕐 *Horário:* ${horaFmt}
💅 *Serviço:* ${procFmt}
📱 *WhatsApp:* ${telFmt}
${agend.obs ? `📝 *Observações:* ${agend.obs}` : ''}
`.trim();

    // URL encode the message
    const encodedMessage = encodeURIComponent(message);

    // CallMeBot API endpoint
    const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${whatsappPhone}&text=${encodedMessage}&apikey=${whatsappApiKey}`;

    // Send notification (non-blocking for Vercel)
    const notificationResponse = await fetch(callmebotUrl, { method: 'GET' });
    const notificationText = await notificationResponse.text();

    // Check if successful
    if (notificationResponse.ok && notificationText.includes('success')) {
      console.log('WhatsApp notification sent successfully');
      return res.status(200).json({ 
        success: true, 
        notification: 'sent',
        messageId: uuidv4()
      });
    } else {
      console.error('WhatsApp notification failed:', notificationText);
      // Still return 200 to not break UI, but indicate failure
      return res.status(200).json({ 
        success: true, 
        notification: 'failed',
        error: notificationText.substring(0, 100)
      });
    }
  } catch (error) {
    console.error('Error in notify endpoint:', error);
    // Return 200 to not break UI flow, but log error
    return res.status(200).json({ 
      success: true, 
      notification: 'error',
      error: error.message.substring(0, 100)
    });
  }
};