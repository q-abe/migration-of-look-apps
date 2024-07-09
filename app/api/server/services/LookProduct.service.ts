/**
 * LookProductに関するビジネスロッジクを管理するクラス
 */
export class LookProductService {
  /**
   * LookProduct情報を全件取得します。
   * @returns LookProduct情報一覧
   */
  static getAll = async () => {
    return prisma.look_products.findMany();
  };

  /**
   * 指定されたIDのLookProduct情報を取得します。
   * @param id ID
   * @returns LookProduct情報
   */
  static getById = async (id: number) => {
    return prisma.look_products.findUnique(id);
  };

  /**
   * LookProduct情報を作成します。
   * @returns 作成されたLookProduct情報
   */
  static create = async (
    lookId: number,
    _lookProducts: { productId: string; productHandle: string }[]
  ) => {
    /* DBにギャラリーとルックの中間テーブルを保存 */
    const lookProducts = await LookProduct.bulkCreate(
      _lookProducts.map((lookProduct) => ({
        lookId,
        productId: lookProduct.productId,
        productHandle: lookProduct.productHandle,
        spotX: 0,
        spotY: 0,
      }))
    );

    return lookProducts;
  };

  /**
   * 指定されたIDのLookProduct情報を更新します。
   * @returns 更新したLookProduct情報
   */
  static update = async (
    lookId: number,
    lookProducts: { productId: string; productHandle: string }[]
  ) => {
    // 一度削除して作り直す
    await LookProduct.destroy({ where: { lookId } });
    return LookProductService.create(lookId, lookProducts);
  };

  /**
   * 指定されたIDのLookProduct情報を削除します。
   * @param id 削除対象のID
   * @returns 削除された数
   */
  static remove = async (id: number) => {
    return LookProduct.destroy({ where: { id } });
  };
}
