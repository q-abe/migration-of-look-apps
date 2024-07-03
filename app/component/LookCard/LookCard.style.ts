import { css } from "@emotion/react";

export const styles = {
  card: css`
    aspect-ratio: 3/4;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    width: 120px;
  `,
  image: (canClick: boolean) => css`
    ${canClick ? "cursor: pointer;" : ""}
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `,
  iconGroup: css`
    display: flex;
    justify-content: space-between;
    padding: 5px;
    z-index: 1;
  `,
} as const;
