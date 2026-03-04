import { generateChallenges } from '../agents/challengeGeneratorAgent';
import { BudgetCategory, Challenge, FamilyMember } from '../../types';

/**
 * Challenge refresh workflow.
 *
 * Step 1: Compute over/under-budget signals from categories.
 * Step 2: Run challengeGeneratorAgent to produce 3 new personalized challenges.
 * Step 3: Filter out any with IDs that already exist (safety dedup).
 *
 * The caller is responsible for persisting the returned challenges via
 * addGeneratedChallenges from AppContext.
 */
export async function refreshChallenges(
  categories: BudgetCategory[],
  familyMembers: FamilyMember[],
  existingChallenges: Challenge[]
): Promise<Challenge[]> {
  const newChallenges = await generateChallenges({ categories, familyMembers });

  const existingIds = new Set(existingChallenges.map(c => c.id));
  return newChallenges.filter(c => !existingIds.has(c.id));
}
