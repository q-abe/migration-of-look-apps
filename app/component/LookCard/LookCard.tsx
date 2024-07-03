import { Image } from "@shopify/polaris";
import { memo } from "react";

import { styles } from "./LookCard.style";

type Props = {
  /** 画像パス */
  imagePath: string;
  onClickImage?: () => void;
  /** 上部アイコン. 最大2つ設定可能で上部の左右に表示される */
  headIcons?: [JSX.Element?, JSX.Element?];
  /** 下部アイコン. 最大2つ設定可能で下部の左右に表示される */
  footIcons?: [JSX.Element?, JSX.Element?];
};

export const LookCard = memo(
  ({ imagePath, onClickImage, headIcons, footIcons }: Props) => {
    return (
      <div css={styles.card}>
        <div css={styles.image(!!onClickImage)} onClick={onClickImage}>
          <Image source={imagePath} alt="" width="100%" height="100%" />
        </div>
        <div css={styles.iconGroup}>{headIcons}</div>
        <div css={styles.iconGroup}>{footIcons}</div>
      </div>
    );
  }
);
