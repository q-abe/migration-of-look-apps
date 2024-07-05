import type { Request, Response } from "express";

import { getIdParam } from "../helpers/request.js";
import { getSession } from "../utils/shopifyUtils.js";

import { GalleryService } from "../services/Gallery.service.js";

/**
 * ギャラリーを操作するクラス
 */
export class GalleryController {
  /**
   * Gallery情報を全件取得します。
   */
  static getAll = async (req: Request, res: Response) => {
    const session = await getSession(req, res);
    const galleries = await GalleryService.getAll(session);

    res.status(200).json(galleries);
  };

  /**
   * 指定されたIDのGallery情報を取得します。
   */
  static getById = async (req: Request, res: Response) => {
    const id = getIdParam(req) as number;
    const session = await getSession(req, res);
    const gallery = await GalleryService.getById(session, id);

    if (gallery) {
      res.status(200).json(gallery);
    } else {
      res.status(404).send("404 - Not found");
    }
  };

  /**
   * Gallery情報を作成します。
   */
  static create = async (req: Request, res: Response) => {
    const { title, looks } = req.body;
    const gallery = await GalleryService.create(title, looks);

    res.status(201).json(gallery);
  };

  /**
   * 指定されたIDのGallery情報を更新します。
   */
  static update = async (req: Request, res: Response) => {
    const id = getIdParam(req) as number;
    const session = await getSession(req, res);
    const { title, isActive, looks } = req.body;
    const updatedGallery = await GalleryService.update(
      session,
      id,
      title,
      isActive,
      looks
    );

    res.status(200).json(updatedGallery);
  };

  /**
   * 指定されたIDのGallery情報を削除します。
   */
  static remove = async (req: Request, res: Response) => {
    const id = getIdParam(req);
    await GalleryService.remove(id);

    res.status(204).end();
  };
}
