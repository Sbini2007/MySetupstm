const DEFAULT_BASE = "https://api-m.sandbox.paypal.com";

function getApiBase() {
  return process.env.PAYPAL_API_BASE || DEFAULT_BASE;
}

export async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${getApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

/**
 * @param {string} ownerEmail - tied to the logged-in account (custom_id)
 * @param {string} amount - e.g. "15.00"
 * @param {string} currency - e.g. "EUR"
 */
export async function createPayPalOrder(ownerEmail, amount = "15.00", currency = "EUR") {
  const accessToken = await getPayPalAccessToken();
  const res = await fetch(`${getApiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: currency, value: amount },
          custom_id: ownerEmail,
          description: "MySetups premium access (one-time)",
        },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || JSON.stringify(data) || `PayPal create order failed: ${res.status}`);
  }
  return data;
}

export async function capturePayPalOrder(orderId) {
  const accessToken = await getPayPalAccessToken();
  const res = await fetch(`${getApiBase()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || JSON.stringify(data) || `PayPal capture failed: ${res.status}`);
  }
  return data;
}

/** Extract custom_id (owner email) from a capture API response */
export function getCustomIdFromCaptureResponse(payload) {
  const unit = payload?.purchase_units?.[0];
  return unit?.custom_id || unit?.payments?.captures?.[0]?.custom_id || null;
}
