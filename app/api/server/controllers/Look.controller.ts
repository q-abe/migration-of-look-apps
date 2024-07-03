import { Request, Response } from "express";

import { getIdParam } from "../helpers/request.js";
import { getSession } from "../utils/shopifyUtils.js";

import { LookService } from "../services/Look.service.js";

/**
 * ルックを操作するクラス
 */
export class LookController {
  /**
   * Look情報を全件取得します。
   */
  static getAll = async (req: Request, res: Response) => {
    const session = await getSession(req, res);
    const looks = await LookService.getAll(session);

    res.status(200).json(looks);
  };

  /**
   * 指定されたIDのLook情報を取得します。
   */
  static getById = async (req: Request, res: Response) => {
    const session = await getSession(req, res);
    const id = getIdParam(req) as number;
    const look = await LookService.getById(session, id);

    if (look) {
      res.status(200).json(look);
    } else {
      res.status(404).send("404 - Not found");
    }
  };

  /**
   * Look情報を作成します。
   */
  static create = async (req: Request, res: Response) => {
    const session = await getSession(req, res);
    const looks = await LookService.create(session, req.body.assets);

    res.status(201).json(looks);
  };

  /**
   * 指定されたIDのLook情報を更新します。
   */
  static update = async (req: Request, res: Response) => {
    const session = await getSession(req, res);
    const id = getIdParam(req) as number;
    const { galleries, products, ...look } = req.body;
    const updatedLook = await LookService.update(
      session,
      id,
      look,
      galleries,
      products
    );

    res.status(200).json(updatedLook);
  };

  /**
   * 指定されたIDのLook情報を削除します。
   */
  static remove = async (req: Request, res: Response) => {
    const id = getIdParam(req);
    await LookService.remove(id);

    res.status(204).end();
  };
}
