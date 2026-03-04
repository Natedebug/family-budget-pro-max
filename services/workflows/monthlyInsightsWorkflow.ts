import { analyzeBudget, BudgetAnalysisInput } from '../agents/budgetAnalystAgent';
import { coachSavings, SavingsCoachInput } from '../agents/savingsCoachAgent';

export interface MonthlyInsightsResult {
  budgetSummary: string;
  savingsCoaching: string;
}

/**
 * Monthly insights workflow.
 *
 * Runs the budget analyst and savings coach agents in parallel and returns
 * a combined result for rendering on an overview screen.
 */
export async function runMonthlyInsights(
  budgetInput: BudgetAnalysisInput,
  savingsInput: SavingsCoachInput
): Promise<MonthlyInsightsResult> {
  const [budgetSummary, savingsCoaching] = await Promise.all([
    analyzeBudget(budgetInput),
    coachSavings(savingsInput),
  ]);
  return { budgetSummary, savingsCoaching };
}
