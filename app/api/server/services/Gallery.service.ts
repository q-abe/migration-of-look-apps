import { Op } from "sequelize";

import { SessionInterface } from "@shopify/shopify-api";
import { Asset } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";

import { LookRequest } from "../../../../../Documents/Project/Q/public-look-app/src/types/Look.type.js";
import { Gallery, Look, LookProduct } from "../../database/models";

import { GalleryLookService } from "./GalleryLook.service.js";
import { MediaService } from "./Media.service.js";
import { GalleryResponse } from "../../../../../Documents/Project/Q/public-look-app/src/types/Gallery.type.js";
import { addWidthQuery } from "../utils/urlUtils.js";

/**
 * ギャラリーに関するビジネスロッジクを管理する
 */
export class GalleryService {
  /**
   * ギャラリーを全件取得します。Ï
   * @returns ギャラリー一覧
   */
  static getAll = async (session: SessionInterface) => {
    const galleries = await Gallery.findAll({
      order: [["id", "DESC"]],
      include: Look,
    });
    if (!galleries.length) return [];

    const medias = await MediaService.getAll(session);
    return galleries.map((gallery) => makeResponse(gallery, medias));
  };

  /**
   * 指定されたIDを元にギャラリーを取得します。
   * @param id ギャラリーID
   * @returns ギャラリー
   */
  static getById = async (session: SessionInterface, id: number) => {
    const gallery = await Gallery.findByPk(id, { include: Look });
    if (gallery == null) return null;

    const medias = await MediaService.getAll(session);
    return makeResponse(gallery, medias);
  };

  /**
   * 指定されたIDを元にギャラリーを取得します。Mediaはshopifyから取得しません。
   * そのため、sessionは不要です。
   *
   * NOTICE:
   *  なぜかここでproductの順序を変更しようとすると、Lookの順序も変わってしまうので、
   *  js側でproductの順序を変更する。
   *
   * @param id ギャラリーID
   * @returns ギャラリー
   */
  static getByIdWithoutMedia = async (id: number) => {
    const gallery = await Gallery.findByPk(id, {
      include: [
        {
          model: Look,
          include: [
            {
              model: LookProduct,
              as: "products",
              attributes: ["productId", "productHandle"],
            },
          ],
          where: {
            isActive: true,
            publishedAt: { [Op.or]: [null, { [Op.lt]: new Date() }] },
            unpublishedAt: { [Op.or]: [null, { [Op.gt]: new Date() }] },
          },
          required: false,
        },
      ],
    });
    if (gallery == null) return null;

    return makeResponseWithoutMedia(gallery);
  };

  /**
   * ギャラリーを作成します。
   * @param title タイトル
   * @param looks ギャラリーに紐付くルック一覧
   * @returns 作成されたギャラリー
   */
  static create = async (title: string, looks: LookRequest[]) => {
    const now = new Date();
    const gallery = await Gallery.create({
      title,
      isActive: false,
      registeredAt: now,
      modifiedAt: now,
    });

    // ギャラリーとルックの中間テーブルも作成
    await GalleryLookService.create(gallery.id, looks);
    return { ...gallery.get(), looks };
  };

  /**
   * 指定されたIDのギャラリーを更新します。
   * @param id 更新対象のギャラリーID
   * @param title タイトル
   * @param isActive 有効/無効
   * * @param looks ギャラリーに紐付くルック一覧
   * @returns 更新された数
   */
  static update = async (
    session: SessionInterface,
    id: number,
    title: string,
    isActive: boolean,
    looks: LookRequest[]
  ) => {
    // ギャラリーを更新
    await Gallery.update(
      {
        title,
        isActive,
        modifiedAt: new Date(),
      },
      { where: { id } }
    );

    // ギャラリーとルックの中間テーブルも更新
    await GalleryLookService.update(id, looks);

    // 更新後のギャラリーを取得して返す
    return GalleryService.getById(session, id);
  };

  /**
   * 指定されたIDのギャラリーを削除します。
   * @param id 削除対象のギャラリーID
   * @returns 削除 成功/失敗
   */
  static remove = async (id: number | number[]) => {
    const destroyedCount = await Gallery.destroy({ where: { id } });
    await GalleryLookService.remove({ galleryId: id });
    return !!destroyedCount;
  };
}

/**
 * レスポンスを作成します。
 * @param gallery ギャラリー
 * @param medias メディア一覧
 * @returns レスポンス
 */
const makeResponse = (gallery: Gallery, medias: Asset[]): GalleryResponse => {
  // ギャラリーと画像を紐付けてレスポンスを生成
  const looks =
    gallery?.get("looks")?.map((look) => ({
      ...look.get(),
      isFeatured: look.get("galleryLook")?.get("isFeatured") ?? false,
      mediaUrl: medias.find((media) => look.get("mediaKey") === media.key)
        ?.public_url,
    })) ?? [];
  return { ...gallery?.get(), looks };
};

const makeResponseWithoutMedia = (gallery: Gallery): GalleryResponse => {
  const looks =
    gallery?.get("looks")?.map((look) => ({
      ...look.get(),
      isFeatured: look.get("galleryLook")?.get("isFeatured") ?? false,
      mediaUrl: addWidthQuery(look.get("mediaUrl")),
    })) ?? [];
  return { ...gallery?.get(), looks };
};
