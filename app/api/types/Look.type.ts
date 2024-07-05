import type { Look } from '../../prisma/models/Look.model.';
import type { GalleryResponse } from "./Gallery.type";

export type LookResponse = Omit<
  Look,
  | keyof typeof Model
  | "galleries"
  /** 日付は Date → string になるので型定義し直す */
  | "registeredAt"
  | "modifiedAt"
  | "publishedAt"
  | "unpublishedAt"
  | "deletedAt"
  | "createdAt"
  | "updatedAt"
> & {
  galleries: GalleryResponse[];
  isFeatured: boolean;
  mediaUrl: string;
  registeredAt?: string;
  modifiedAt?: string;
  publishedAt?: string;
  unpublishedAt?: string;
  deletedAt?: string;
};

export type LookRequest = LookResponse;
