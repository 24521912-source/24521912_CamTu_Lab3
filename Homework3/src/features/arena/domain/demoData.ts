
import type { DropItem, PubgSquad } from './types';

export const DEMO_DATA_NOTICE =
  'Demo data only. Inventory, prices, claims and standings are simulated.';

const demoDropEpochMs = Date.UTC(2027, 0, 20, 12, 0, 0);
const demoExpiresEpochMs = Date.UTC(2027, 0, 20, 14, 0, 0);

export const demoDropItems: readonly DropItem[] = [
  {
    id: 'pvs-vip-ticket',
    kind: 'VIP_TICKET',
    title: 'PVS Grand Finals VIP Ticket',
    description: 'Simulated VIP admission item for the arena demo.',
    priceVnd: 1500000,
    remainingStock: 20,
    dropEpochMs: demoDropEpochMs,
    expiresEpochMs: demoExpiresEpochMs,
  },
  {
    id: 'gcoin-crate',
    kind: 'GCOIN_CRATE',
    title: 'G-Coin Crate',
    description: 'Simulated in-game reward crate for the arena demo.',
    priceVnd: 199000,
    remainingStock: 50,
    dropEpochMs: demoDropEpochMs,
    expiresEpochMs: demoExpiresEpochMs,
  },
];

export const demoSquads: readonly PubgSquad[] = [
  {
    squadId: 'the-expendables',
    squadName: 'The Expendables',
    wwcdCount: 3,
    placementPts: 42,
    killPts: 58,
  },
  {
    squadId: 'cerberus-esports',
    squadName: 'Cerberus Esports',
    wwcdCount: 2,
    placementPts: 48,
    killPts: 52,
  },
  {
    squadId: 'roy-esports',
    squadName: 'Roy Esports',
    wwcdCount: 2,
    placementPts: 39,
    killPts: 47,
  },
  {
    squadId: 'agg',
    squadName: 'AGG',
    wwcdCount: 1,
    placementPts: 35,
    killPts: 44,
  },
];

export function formatPriceVnd(priceVnd: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(priceVnd);
}

export function getSquadTotalPoints(squad: PubgSquad): number {
  return squad.placementPts + squad.killPts;
}
