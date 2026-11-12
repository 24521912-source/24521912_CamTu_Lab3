
import type { DropItem } from './types';

export type DemoScenario =
  | 'scheduled'
  | 'live'
  | 'last-unit'
  | 'sold-out'
  | 'expired';

export function getScenarioOffset(
  scenario: DemoScenario,
  referenceItem: DropItem,
  nowEpochMs = Date.now(),
): number {
  if (scenario === 'scheduled') {
    return 0;
  }

  const simulatedNow =
    scenario === 'expired'
      ? referenceItem.expiresEpochMs + 1000
      : referenceItem.dropEpochMs + 60_000;

  return simulatedNow - nowEpochMs;
}

export function getScenarioItems(
  scenario: DemoScenario,
  baseItems: readonly DropItem[],
): DropItem[] {
  return baseItems.map((item) => {
    switch (scenario) {
      case 'sold-out':
        return {
          ...item,
          remainingStock: 0,
        };

      case 'last-unit':
        return {
          ...item,
          remainingStock: Math.min(
            item.remainingStock,
            1,
          ),
        };

      default:
        return { ...item };
    }
  });
}
