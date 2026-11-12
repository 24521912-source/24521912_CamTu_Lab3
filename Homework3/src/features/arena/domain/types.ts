
export type DropPhase =
  | 'WARMUP'
  | 'AIRDROP_LIVE'
  | 'LOOTED_OUT'
  | 'EXPIRED';

export type DropItemKind = 'VIP_TICKET' | 'GCOIN_CRATE';

export interface DropItem {
  readonly id: string;
  readonly kind: DropItemKind;
  readonly title: string;
  readonly description: string;
  readonly priceVnd: number;
  readonly remainingStock: number;
  readonly dropEpochMs: number;
  readonly expiresEpochMs: number;
}

export interface PubgSquad {
  readonly squadId: string;
  readonly squadName: string;
  readonly wwcdCount: number;
  readonly placementPts: number;
  readonly killPts: number;
}

export type LeaderboardSortKey = 'wwcd' | 'placement' | 'kills';

export type ClaimResult =
  | {
      readonly ok: true;
      readonly itemId: string;
      readonly claimId: string;
    }
  | {
      readonly ok: false;
      readonly itemId: string;
      readonly status: 409;
      readonly reason: 'CONFLICT';
    }
  | {
      readonly ok: false;
      readonly itemId: string;
      readonly status: 503;
      readonly reason: 'SERVICE_UNAVAILABLE';
    };

export type DropEvent =
  | {
      readonly type: 'ACTIVATE';
      readonly nowEpochMs: number;
      readonly item: DropItem;
    }
  | {
      readonly type: 'STOCK_DEPLETED';
      readonly remainingStock: number;
    }
  | {
      readonly type: 'EXPIRE';
      readonly nowEpochMs: number;
      readonly expiresEpochMs: number;
    };
