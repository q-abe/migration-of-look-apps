import { css } from "@emotion/react";

const resetList = css`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const styles = {
  verical: css`
    ${resetList}
    flex-direction: column;
  `,
  horizontal: css`
    ${resetList}
    flex-direction: row;
  `,
  grid: css`
    ${resetList}
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
  `,
  item: ({ isDragging = false, transform = "", transition = "" }) => css`
    opacity: ${isDragging ? 0.4 : 1};
    transform: ${transform};
    transition: ${transition};
  `,
  handle: css`
    cursor: grab;
  `,
};
