// src/lib/whatsapp.ts

export async function sendWhatsAppMessage(to: string, message: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

    if (!accountSid || !authToken || !fromNumber) {
        console.log(`\n[WHATSAPP MOCK] To: ${to} | Message: ${message}\n`);
        return { success: true, mocked: true };
    }

    try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        
        const params = new URLSearchParams();
        // Twilio requires numbers in E.164 format, e.g., +1234567890
        // If the number doesn't start with +, you might need to format it depending on your region
        const formattedTo = to.startsWith('+') ? to : `+${to}`;
        params.append("To", `whatsapp:${formattedTo}`);
        params.append("From", fromNumber);
        params.append("Body", message);

        const response = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Failed to send WhatsApp message via Twilio:', data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return { success: false, error };
    }
}

export async function sendOrderWhatsAppNotification(orderId: string, amount: number, customerPhone?: string, customerName?: string) {
    // Notify Customer if phone exists
    if (customerPhone) {
        const customerMsg = `Hi ${customerName || 'Customer'}, your order #${orderId} for $${amount.toFixed(2)} has been successfully placed at JayBhole Gift Shop! We will notify you once it ships.`;
        await sendWhatsAppMessage(customerPhone, customerMsg);
    }

    // Notify Admin
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER; // Ensure this is set in .env
    if (adminPhone) {
        const adminMsg = `New Order Alert! Order #${orderId} was just placed by ${customerName || 'a customer'} for $${amount.toFixed(2)}.`;
        await sendWhatsAppMessage(adminPhone, adminMsg);
    }
}
