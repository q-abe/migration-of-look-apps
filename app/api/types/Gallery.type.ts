import type { Gallery } from '../../prisma/models/Gallery.model';
import type { LookResponse } from "./Look.type";

export type GalleryResponse = Omit<Gallery, keyof typeof Model | "looks"> & {
  looks: LookResponse[];
};

export type GalleryRequest = GalleryResponse;
