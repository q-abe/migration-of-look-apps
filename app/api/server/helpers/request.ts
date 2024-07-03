import { Request } from "express";

/**
 * クエリパラメータからIDを取得します。
 * @returns { number | number[] } ID
 */
export const getIdParam = (req: Request) => {
  const id = req.params.id;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  } else if (/^\d+(,\d+)+/.test(id)) {
    return id.split(",").map((id) => Number.parseInt(id, 10));
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
};
