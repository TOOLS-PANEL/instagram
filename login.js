export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { message } = req.body;
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
        console.error('Missing environment variables');
        return res.status(500).json({ success: false, message: 'Configuration error' });
    }
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error('Telegram API error:', result);
            return res.status(500).json({ success: false, message: 'Telegram API error' });
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return res.status(500).json({ success: false, message: 'Network error' });
    }
}