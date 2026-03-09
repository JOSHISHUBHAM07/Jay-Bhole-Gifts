import { Resend } from 'resend';

// Only initialize if the API key is present, otherwise fallback to console logs for testing.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOrderConfirmationEmail(userEmail: string, orderId: string, orderTotal: number) {
    try {
        const emailContent = `
            <h2>GiftAura Order Confirmation</h2>
            <p>Thank you for your premium purchase!</p>
            <p>Your Order ID is: <strong>${orderId}</strong></p>
            <p>Order Total: <strong>$${orderTotal.toFixed(2)}</strong></p>
            <p>We'll notify you once it ships.</p>
            <br/>
            <p>Stay radiant,</p>
            <p>The GiftAura Team</p>
        `;

        if (resend) {
            await resend.emails.send({
                from: 'GiftAura Orders <orders@giftaura.com>', // Replace with verified domain if deploying
                to: userEmail,
                subject: `Order Confirmed: ${orderId}`,
                html: emailContent,
            });
            console.log(`[Email Service] Sent confirmation email to ${userEmail} via Resend.`);
        } else {
            console.log(`[Email Service] (Mock) Sent confirmation email to ${userEmail} for Order ${orderId}. Provide RESEND_API_KEY to send real emails.`);
        }
    } catch (error) {
        console.error("[Email Service] Failed to send order confirmation:", error);
    }
}
