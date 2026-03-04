import { scanReceipt, ReceiptScanResult } from '../agents/receiptScannerAgent';

/**
 * Expense capture workflow.
 *
 * Step 1: Run receiptScannerAgent on the provided image data URL.
 * Step 2: Return structured merchant/total fields for the UI to pre-fill.
 *
 * The caller (AddExpenseFlow / AddExpenseModal) is responsible for presenting
 * the pre-filled form and calling addTransaction when the user confirms.
 */
export async function processReceiptCapture(imageDataUrl: string): Promise<ReceiptScanResult> {
  return scanReceipt(imageDataUrl);
}
