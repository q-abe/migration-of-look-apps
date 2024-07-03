import { BaseAPI } from "./BaseAPI";

const API_URI = "/api/galleryLooks/";

/**
 * ギャラリー、ルック情報を操作するAPIクラス
 */
export class GalleryLookAPI extends BaseAPI {
  /**
   * ルック情報を全件取得します。
   * @returns ルック情報一覧
   */
  getAll = async () => {
    return this.fetch(API_URI).then((res) => res?.json());
  };

  /**
   * 指定されたIDのルック情報を取得します。
   * @param id ルックID
   * @returns ルック情報
   */
  getByID = async (id: number) => {
    return this.fetch(API_URI).then((res) => res?.json());
  };

  /**
   * 指定されたAsset情報を元に、Look情報を作成します。
   * @param assets
   * @returns 作成したLook情報
   */
  create = async (
    assets: {
      fileName: string;
      attachment: string | ArrayBuffer | null;
    }[]
  ) => {
    return this.fetch(API_URI, {
      method: "POST",
      body: JSON.stringify({ assets }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res?.json());
  };

  /**
   * 指定されたIDのルック情報を更新します。
   * @param id ルックID
   * @returns 更新後のルック情報
   */
  update = async (id: number) => {
    return this.fetch(API_URI, { method: "PUT" }).then((res) => res?.json());
  };

  /**
   * 指定されたIDのルック情報を削除します。
   * @param ids ルックID一覧
   * @returns 削除後のルック情報一覧
   */
  delete = async (ids: number[]) => {
    return this.fetch(`${API_URI}${ids.join(",")}`, {
      method: "DELETE",
    }).then((res) => res?.json());
  };
}
