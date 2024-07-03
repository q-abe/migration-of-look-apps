import { Shopify, SessionInterface } from "@shopify/shopify-api";
import { Theme } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";
import { Request, Response } from "express";

/**
 * セッションを取得します。
 * @param req リクエストオブジェクト
 * @param res レスポンスオブジェクト
 * @returns セッション
 */
export const getSession = async (req: Request, res: Response) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, true);
  if (session == null) throw new Error("Session is undefined");
  return session;
};

/**
 * テーマIDを取得します。
 * @param session セッション
 * @returns テーマID
 */
export const getThemeId = async (session: SessionInterface) => {
  const themes = await Theme.all({ session });
  return themes.length > 0 ? themes[0].id : undefined;
};
