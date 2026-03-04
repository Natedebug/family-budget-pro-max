import { getOpenAIClient } from '../openai';
import { BudgetCategory, Challenge, ChallengeType, FamilyMember } from '../../types';

export interface ChallengeGeneratorInput {
  categories: BudgetCategory[];
  familyMembers: FamilyMember[];
}

/**
 * Generates 3 personalized challenges (1 daily, 1 weekly, 1 member) based on current spending.
 * Uses GPT-4o-mini with JSON mode.
 */
export async function generateChallenges(input: ChallengeGeneratorInput): Promise<Challenge[]> {
  const { categories, familyMembers } = input;
  const client = getOpenAIClient();

  const overBudget = categories
    .filter(c => c.allocated > 0 && c.spent >= c.allocated * 0.85)
    .map(c => c.name);
  const wellUnder = categories
    .filter(c => c.allocated > 0 && c.spent <= c.allocated * 0.5)
    .map(c => c.name);

  const members = familyMembers.filter(m => m.role !== 'kid');
  const challenger = members[0]?.id ?? familyMembers[0]?.id ?? 'dad';
  const challenged = members[1]?.id ?? familyMembers[1]?.id ?? 'mom';

  const prompt = `You are a gamification engine for a family budget app.
Generate exactly 3 new spending challenges for the family.

Return a JSON object in this exact format (no markdown fences):
{
  "challenges": [
    {
      "id": "ai-daily-<timestamp>",
      "type": "daily",
      "title": "...",
      "description": "...",
      "points": <number between 40 and 100>,
      "icon": "<single emoji>",
      "isCompleted": false
    },
    {
      "id": "ai-weekly-<timestamp>",
      "type": "weekly",
      "title": "...",
      "description": "...",
      "points": <number between 300 and 750>,
      "icon": "<single emoji>",
      "isCompleted": false
    },
    {
      "id": "ai-member-<timestamp>",
      "type": "member",
      "title": "...",
      "description": "...",
      "points": <number between 150 and 300>,
      "icon": "⚔️",
      "isCompleted": false,
      "challengerId": "${challenger}",
      "challengedId": "${challenged}",
      "status": "pending"
    }
  ]
}

Replace <timestamp> with a unique number like ${Date.now()}.
Family spending context:
- Categories over or near budget: ${overBudget.join(', ') || 'none'}
- Categories well under budget: ${wellUnder.join(', ') || 'none'}
- Family members: ${familyMembers.map(m => m.name).join(', ')}

Make the daily and weekly challenges specific to the over-budget categories when possible.
The member challenge should be fun and competitive between ${members[0]?.name ?? 'Dad'} and ${members[1]?.name ?? 'Mom'}.`.trim();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0].message.content ?? '{"challenges":[]}';

  try {
    const parsed = JSON.parse(raw);
    const arr: Challenge[] = Array.isArray(parsed)
      ? parsed
      : (parsed.challenges ?? []);

    return arr.map((c: Challenge & { type: string }) => ({
      ...c,
      type:
        c.type === 'daily'
          ? ChallengeType.DAILY
          : c.type === 'weekly'
          ? ChallengeType.WEEKLY
          : ChallengeType.MEMBER,
    }));
  } catch {
    return [];
  }
}
