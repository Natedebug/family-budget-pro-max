import { getOpenAIClient } from '../openai';
import { BudgetCategory, FamilyMember, Transaction } from '../../types';

export interface BudgetAnalysisInput {
  member: FamilyMember;
  income: number;
  categories: BudgetCategory[];
  recentTransactions: Transaction[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

/**
 * Generates a friendly budget health summary for the given member and spending data.
 * Uses GPT-4o-mini.
 */
export async function analyzeBudget(input: BudgetAnalysisInput): Promise<string> {
  const { member, income, categories, recentTransactions } = input;
  const client = getOpenAIClient();

  const budgetDetails = categories
    .map(c => `- ${c.name}: spent ${fmt(c.spent)} of ${fmt(c.allocated)}`)
    .join('\n');

  const txDetails = recentTransactions
    .slice(0, 5)
    .map(t => `- ${t.merchant}: ${fmt(t.amount)}`)
    .join('\n');

  const prompt = `You are a friendly financial assistant for a family budget app.
Based on the data below, write a concise budget health summary for ${member.name}.

Guidelines:
1. Start with an encouraging opener addressed to ${member.name}.
2. Highlight 1-2 categories that are well-controlled (under 70% of budget).
3. Gently note 1-2 categories that are at risk or over budget.
4. Give one simple, actionable tip.
5. Keep it to 3-4 short paragraphs.
6. Use markdown (bold category names, bullet points where helpful).

Monthly Income: ${fmt(income)}
User: ${member.name}

Budget Categories:
${budgetDetails}

Recent Transactions:
${txDetails || '(none)'}`.trim();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content ?? 'Unable to generate summary at this time.';
}
