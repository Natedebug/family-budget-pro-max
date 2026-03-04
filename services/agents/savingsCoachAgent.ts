import { getOpenAIClient } from '../openai';
import { BudgetCategory } from '../../types';

export interface SavingsCoachInput {
  savingsBalance: number;
  income: number;
  categories: BudgetCategory[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

/**
 * Generates savings coaching advice based on current balance, income, and spending patterns.
 * Uses GPT-4o-mini.
 */
export async function coachSavings(input: SavingsCoachInput): Promise<string> {
  const { savingsBalance, income, categories } = input;
  const client = getOpenAIClient();

  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const overBudget = categories
    .filter(c => c.allocated > 0 && c.spent > c.allocated)
    .map(c => `- ${c.name}: over by ${fmt(c.spent - c.allocated)}`);

  const prompt = `You are a warm, encouraging savings coach for a family budget app.

Current Situation:
- Monthly income: ${fmt(income)}
- Total spent this month: ${fmt(totalSpent)}
- Current savings balance: ${fmt(savingsBalance)}
- Remaining this month: ${fmt(Math.max(0, income - totalSpent))}
${overBudget.length ? `\nOver-budget categories:\n${overBudget.join('\n')}` : '\n- No categories are over budget — great discipline!'}

Write a short savings coaching message (2-3 paragraphs) that:
1. Acknowledges their current savings balance with genuine encouragement.
2. Identifies one realistic opportunity to save more based on the spending patterns.
3. Suggests a specific, achievable monthly savings target based on the numbers.
Use markdown for readability (bold key numbers, use bullet points where helpful).`.trim();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content ?? 'Unable to generate savings coaching at this time.';
}
