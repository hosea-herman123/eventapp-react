import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function simulate(checkoutId = 'TEST12345', ok = true) {
  const payload = {
    Body: {
      stkCallback: {
        MerchantRequestID: '12345',
        CheckoutRequestID: checkoutId,
        ResultCode: ok ? 0 : 1,
        ResultDesc: ok ? 'The service request is processed successfully.' : 'Request failed',
        CallbackMetadata: ok ? {
          Item: [
            { Name: 'Amount', Value: 100 },
            { Name: 'MpesaReceiptNumber', Value: 'ABC123' }
          ]
        } : {}
      }
    }
  };

  const url = process.env.MPESA_CALLBACK_URL
    ? `${process.env.MPESA_CALLBACK_URL.replace(/\/$/, '')}/api/payments/callback`
    : 'http://localhost:4000/api/payments/callback';

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  console.log('simulate status', r.status);
  try { console.log(await r.json()); } catch (e) { console.log('no json response'); }
}

const args = process.argv.slice(2);
const id = args[0] || 'TEST12345';
const ok = args[1] !== 'fail';
simulate(id, ok).catch(console.error);