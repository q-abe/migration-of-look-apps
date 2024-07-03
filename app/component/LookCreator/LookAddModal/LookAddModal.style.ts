import { css } from "@emotion/react";

export const styles = {
  thumbnailWrapper: css`
    position: relative;
    height: 165px;
    width: 125px;
  `,
  cancelButton: css`
    position: absolute;
    background: none;
    border: none;
    padding: 0;
    top: 2px;
    right: 2px;
    z-index: 1;

    :hover {
      cursor: pointer;
      background: var(--p-surface-hovered);
    }
  `,
};
