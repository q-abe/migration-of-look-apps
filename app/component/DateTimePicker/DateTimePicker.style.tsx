import { css } from "@emotion/react";

export const styles = {
  ul: css`
    display: flex;
    gap: 10px;
    margin: 0;
    padding: 0;
    width: 100%;
    list-style: none;
  `,
  li: (showLabel = true) => css`
    .Polaris-Labelled__LabelWrapper {
      visibility: ${showLabel ? "visible" : "hidden"};
    }
    height: 84px;
    width: 50%;
  `,
  popoverInner: css`
    padding: 10px;
  `,
};
