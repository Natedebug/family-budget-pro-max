import OpenAI from 'openai';
import { getOpenAIClient } from '../openai';
import { BudgetCategory, FamilyMember, Transaction } from '../../types';

export interface ChatAgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatAgentContext {
  currentUser: FamilyMember;
  income: number;
  categories: BudgetCategory[];
  transactions: Transaction[];
  savingsBalance: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

/**
 * Sends a message to the financial chat assistant and returns its reply.
 * Includes full conversation history and live financial context in the system prompt.
 * Uses GPT-4o-mini.
 */
export async function chat(
  userMessage: string,
  history: ChatAgentMessage[],
  context: ChatAgentContext
): Promise<string> {
  const { currentUser, income, categories, transactions, savingsBalance } = context;
  const client = getOpenAIClient();

  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const overBudget = categories
    .filter(c => c.allocated > 0 && c.spent > c.allocated)
    .map(c => `${c.name} (over by ${fmt(c.spent - c.allocated)})`);
  const recentTx = transactions
    .slice(0, 5)
    .map(t => `${t.merchant}: ${fmt(t.amount)}`)
    .join(', ');

  const systemPrompt = `You are a friendly, knowledgeable family financial assistant embedded in a budget app.
Help the family make smart decisions about budgeting, saving, and spending.

Current user: ${currentUser.name} (role: ${currentUser.role})
Monthly income: ${fmt(income)}
Total spent this month: ${fmt(totalSpent)}
Remaining budget: ${fmt(Math.max(0, income - totalSpent))}
Savings balance: ${fmt(savingsBalance)}
Categories: ${categories.map(c => `${c.name} (${fmt(c.spent)}/${fmt(c.allocated)})`).join(', ')}
${overBudget.length ? `Over-budget: ${overBudget.join(', ')}` : 'No categories are over budget.'}
Recent transactions: ${recentTx || 'none'}

Keep responses concise, warm, and actionable. Use markdown for clarity when helpful.
Never share or suggest sharing the OpenAI API key.`.trim();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 600,
  });

  return (
    response.choices[0].message.content ??
    "Sorry, I'm having trouble responding right now. Please try again."
  );
}
