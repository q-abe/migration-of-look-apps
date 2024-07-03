import { SessionInterface } from "@shopify/shopify-api";
import { Asset } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";

import { getThemeId } from "../utils/shopifyUtils.js";
import { addWidthQuery } from "../utils/urlUtils.js";

/**
 * Shopify Assetに関するビジネスロッジクを管理する
 */
export class MediaService {
  /**
   * Assetから画像情報を取得します。
   * @returns アセット一覧
   */
  static getAll = async (session: SessionInterface) => {
    const themeId = await getThemeId(session);
    const assets = await Asset.all({ session, theme_id: themeId });
    assets.forEach((asset) => {
      asset.public_url = addWidthQuery(asset.public_url);
    });
    return assets;
  };

  /**
   * Assetを作成します。
   * @returns 作成されたアセット一覧
   */
  static create = async (
    session: SessionInterface,
    assets: { fileName: string; attachment: string }[]
  ) => {
    const themeId = await getThemeId(session);

    return Promise.all<Asset>(
      assets.map(async (assetData) => {
        const asset = new Asset({
          session,
          fromData: {
            theme_id: themeId,
            // 半角英数字でないと失敗するので、半角英数字以外は削除
            key: `assets/${assetData.fileName.replace(/[^A-Za-z0-9\.]/g, "")}`,
            // base64の "data:xxx/xxx;base64," の部分は不要なので削除（あると画像が読み込めない）
            attachment: assetData.attachment.replace(
              /^data:\w+\/\w+;base64,/,
              ""
            ),
          },
        });
        await asset.saveAndUpdate();
        asset.public_url = addWidthQuery(asset.public_url);
        return asset;
      })
    );
  };
}
