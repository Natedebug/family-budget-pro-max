import { getOpenAIClient } from '../openai';

export interface ReceiptScanResult {
  merchant: string | null;
  total: number | null;
}

/**
 * Scans a receipt image (as a data URL) and returns the extracted merchant and total.
 * Uses GPT-4o vision.
 */
export async function scanReceipt(imageDataUrl: string): Promise<ReceiptScanResult> {
  const client = getOpenAIClient();

  const prompt =
    'Analyze this receipt image and extract the merchant name and the total amount paid. ' +
    'Return ONLY a JSON object in exactly this format: {"merchant": "Name", "total": 123.45}. ' +
    'Use null for any field you cannot determine with confidence.';

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: imageDataUrl } },
          { type: 'text', text: prompt },
        ],
      },
    ],
    max_tokens: 200,
  });

  const raw = (response.choices[0].message.content ?? '{}').replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(raw) as ReceiptScanResult;
  } catch {
    return { merchant: null, total: null };
  }
}
