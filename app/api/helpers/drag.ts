export interface HasStringId {
  id: string;
}

export const replaceOrderById = <T extends HasStringId>(
  items: T[],
  fromId?: string,
  toId?: string
): T[] => {
  if (typeof fromId === "undefined" || typeof toId === "undefined")
    return items;
  const result = Array.from(items);
  const fromIndex = getIndexById<T>(result, fromId);
  const toIndex = getIndexById(result, toId);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

export const dropOrderById = <T extends HasStringId>(
  items: T[],
  targetId?: string
): T[] => {
  if (typeof targetId === "undefined") return items;
  const result = Array.from(items);
  const targetIndex = getIndexById(items, targetId);
  result.splice(targetIndex, 1);
  return result;
};

export const getIndexById = <T extends HasStringId>(
  items: T[],
  targetId?: string | null
) => {
  return items.findIndex((item) => item.id === targetId);
};
