import type { LookResponse } from "./Look.type";

export type LookCard = LookResponse & {
  isSelected?: boolean;
};
