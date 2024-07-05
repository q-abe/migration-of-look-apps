export type ProductOnGraphQL = {
  id: string;
  title: string;
  handle: string;
  images?: {
    nodes?: Image[];
  };
};

export type Image = {
  originalSrc: string;
};
