import { LookRequest } from "../../../../../Documents/Project/Q/public-look-app/src/types/Look.type.js";
import { GalleryLook } from "../../database/models";
import { GalleryRequest } from "../../../../../Documents/Project/Q/public-look-app/src/types/Gallery.type.js";

/**
 * ギャラリーとルックの中間テーブルに関するビジネスロッジクを管理するクラス
 */
export class GalleryLookService {
  /**
   * 指定されたギャラリーIDを元に、全件取得します。
   * @param galleryId ギャラリーID
   * @returns ギャラリールック一覧
   */
  static getAll = async (galleryId: number) => {
    return GalleryLook.findAll({
      where: {
        galleryId,
      },
    });
  };

  /**
   * 指定されたIDを元にギャラリールックを取得します。
   * @param id ギャラリールックID
   * @returns ギャラリールック
   */
  static getById = async (id: number) => {
    return GalleryLook.findByPk(id);
  };

  /**
   * ギャラリールックを作成します。
   * @param galleryId ギャラリーID
   * @param looks ルック一覧
   * @returns 作成されたギャラリールック
   */
  static create = async (galleryId: number, looks: LookRequest[]) => {
    /* DBにギャラリーとルックの中間テーブルを保存 */
    return GalleryLook.bulkCreate(
      looks.map((look) => ({
        galleryId,
        lookId: look.id,
        isFeatured: look.isFeatured,
      }))
    );
  };

  /**
   * 指定されたIDのギャラリールックを更新します。
   * @param galleryId ギャラリーID
   * @param looks ルック一覧
   * @returns 更新したギャラリールック
   */
  static update = async (galleryId: number, looks: LookRequest[]) => {
    // 一度削除して作り直す
    await GalleryLook.destroy({ where: { galleryId } });
    return GalleryLookService.create(galleryId, looks);
  };

  /**
   * 更新不要の中間テーブルは更新せずに、
   * 不要なものの削除と新規のものを追加する
   *
   * 登録時刻をorderとして扱っているため、look側からの更新では
   * 全削除を行っての更新をおこなってはいけないためこれを利用する。
   **/
  static sync = async (lookId: number, newGalleries: GalleryRequest[]) => {
    const currentGalleryLooks = await GalleryLook.findAll({
      where: {
        lookId,
      },
    });

    const unnecessaryGalleryLooks = currentGalleryLooks.filter(
      (currentGalleryLook) => {
        return newGalleries.every(
          (gallery) => gallery.id !== currentGalleryLook.galleryId
        );
      }
    );

    await GalleryLook.destroy({
      where: {
        id: unnecessaryGalleryLooks.map((galleryLook) => galleryLook.id),
      },
    });

    const galleryLooks = await GalleryLook.bulkCreate(
      newGalleries.map((gallery) => ({
        galleryId: gallery.id,
        lookId,
        isFeatured: false,
      })),
      {
        ignoreDuplicates: true,
      }
    );

    return galleryLooks;
  };

  /**
   * 指定された情報のギャラリールックを削除します。
   * @param attribute 削除対象の情報
   * @returns 削除された数
   */
  static remove = async (attribute: {
    galleryId?: number | number[];
    lookId?: number | number[];
  }) => {
    return GalleryLook.destroy({ where: attribute });
  };
}
