import type { GalleryResponse } from '~/api/types/Gallery.type';
import type { LookRequest } from '~/api/types/Look.type';
import { BaseAPI } from "./BaseAPI";

const API_URI = "/api/galleries/";

/**
 * ギャラリー情報を操作するAPIクラス
 */
export class GalleryAPI extends BaseAPI {
  /**
   * ギャラリーを全件取得します。
   * @returns ギャラリー一覧
   */
  getAll = async (): Promise<GalleryResponse[]> => {
    return this.fetch(API_URI).then((res) => res?.json());
  };

  /**
   * 指定されたIDのルック情報を取得します。
   * @param id ルックID
   * @returns ルック情報
   */
  getByID = async (id: number): Promise<GalleryResponse> => {
    return this.fetch(`${API_URI}${id}`).then((res) => res?.json());
  };

  /**
   * 指定された情報を元に、ギャラリーを作成します。
   * @param title タイトル
   * @param looks ルック情報一覧
   * @returns 作成したギャラリー
   */
  create = async (
    title: string,
    looks: LookRequest[]
  ): Promise<GalleryResponse> => {
    return this.fetch(API_URI, {
      method: "POST",
      body: JSON.stringify({ title, looks }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res?.json());
  };

  /**
   * 指定されたIDのギャラリーを更新します。
   * @param id 更新対象のギャラリーID
   * @param title タイトル
   * @param looks ルック情報一覧
   * @param isActive ステータス
   * @returns 更新後のギャラリー
   */
  update = async (
    id: number,
    title: string,
    looks: LookRequest[],
    isActive: boolean = false
  ): Promise<GalleryResponse> => {
    return this.fetch(`${API_URI}${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, title, looks, isActive }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res?.json());
  };

  /**
   * 指定されたIDのギャラリーを削除します。
   * @param id
   */
  delete = async (id: number) => {
    await this.fetch(`${API_URI}${id}`, { method: "DELETE" });
  };
}
