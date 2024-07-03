import { SessionInterface } from "@shopify/shopify-api";
import { Asset } from "@shopify/shopify-api/dist/rest-resources/2022-04/asset.js";
import { GalleryRequest } from "../../../../../Documents/Project/Q/public-look-app/src/types/Gallery.type.js";
import { LookResponse } from "../../../../../Documents/Project/Q/public-look-app/src/types/Look.type.js";
import { Gallery, Look, LookProduct } from "../../database/models";
import { GalleryLookService } from "./GalleryLook.service.js";
import { MediaService } from "./Media.service.js";
import { LookProductService } from "./LookProduct.service.js";

/**
 * ルックに関するビジネスロッジクを管理するクラス
 */
export class LookService {
  /**
   * ルックを全件取得します。
   * @returns ルック一覧
   */
  static getAll = async (session: SessionInterface) => {
    const looks = await Look.findAll({
      include: [
        Gallery,
        {
          model: LookProduct,
          as: "products",
          attributes: ["productId", "productHandle"],
        },
      ],
      order: [
        ["id", "DESC"],
        ["products", "id", "ASC"],
      ],
    });
    const medias = await MediaService.getAll(session);

    return looks.map((look) => makeResponse(look, medias));
  };

  /**
   * 指定されたIDを元にルックを取得します。
   * @param id ルックID
   * @returns ルック
   */
  static getById = async (session: SessionInterface, id: number) => {
    const look = await Look.findByPk(id, {
      include: [
        Gallery,
        {
          model: LookProduct,
          as: "products",
          attributes: ["productId", "productHandle"],
        },
      ],
      order: [["products", "id", "ASC"]],
    });
    if (look == null) return null;

    const medias = await MediaService.getAll(session);
    return makeResponse(look, medias);
  };

  /**
   * ルックを作成します。
   * @param session セッション
   * @param assets アセット一覧
   * @returns 作成されたルック
   */
  static create = async (
    session: SessionInterface,
    assets: {
      fileName: string;
      attachment: string;
    }[]
  ) => {
    const medias = await MediaService.create(session, assets);
    const looks = await Look.bulkCreate(
      medias.map((media) => ({
        mediaKey: media.key,
        mediaUrl: media.public_url,
        isActive: true,
        shouldDisplayProduct: false,
        registeredAt: new Date(),
      }))
    );

    // 全件取得時に`id`の降順で取得しているので、同じ並び順になるようreverse()してレスポンスを生成する
    return looks.reverse().map((look) => makeResponse(look, medias));
  };

  /**
   * 指定されたIDのルックを更新します。
   * @param id 更新対象のルックID
   * @param look ルック情報
   * @param galleries ギャラリー一覧
   * @returns 更新したルック
   */
  static update = async (
    session: SessionInterface,
    id: number,
    look: Look,
    galleries: GalleryRequest[],
    products: any[]
  ) => {
    await Look.update(look, { where: { id } });
    await GalleryLookService.sync(id, galleries);
    await LookProductService.update(id, products);

    // 更新後のルック情報を取得して返す
    return await LookService.getById(session, id);
  };

  /**
   * 指定されたIDのルックを削除します。
   * @param id 削除対象のルックID
   * @returns 削除 成功/失敗
   */
  static remove = async (id: number | number[]) => {
    const destroyedCount = await Look.destroy({ where: { id } });
    await GalleryLookService.remove({ lookId: id });

    return !!destroyedCount;
  };
}

/**
 * レスポンスを作成します。
 * @param looks ルック一覧
 * @param medias メディア一覧
 * @returns レスポンス
 */
const makeResponse = (look: Look, medias: Asset[]): LookResponse[] => {
  return {
    ...look.get(),
    mediaUrl: medias.find((media) => look.get("mediaKey") === media.key)
      ?.public_url,
  };
};
