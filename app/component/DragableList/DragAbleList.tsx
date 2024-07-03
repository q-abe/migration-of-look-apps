
import { useCallback, useMemo } from 'react';
import type { HasStringId} from '~/api/helpers/drag';
import { replaceOrderById } from '~/api/helpers/drag';
import { styles } from "./DragableList.style";

export type ReplaceOrderById = typeof replaceOrderById;

const DRAGABLE = {
  LAYOUT: {
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal",
    GRID: "grid",
  },
};

type DragableListProps<T extends HasStringId> = React.PropsWithChildren<{
  /** リストのID、ユニークにした方が良い */
  items: T[];
  /** ドロップした際に実行される関数、引数には並び替え後の配列が入る */
  onDropCallback?: (items: T[]) => void;
  /** ドロップした際に実行される関数、引数には並び替え後の配列が入る */
  onDragCallback?: (activeId: string) => void;
  /** リストの形式 */
  layout?: typeof DRAGABLE.LAYOUT[keyof typeof DRAGABLE.LAYOUT];
}>;

/**
 * ドラッグ可能な一覧を作るコンポーネント
 * 一覧にしたいコンポーネントをDragableItemでラップし、childrenに並べる
 */
const DragAbleList = <T extends HasStringId>({
  items,
  onDropCallback = () => {},
  onDragCallback = () => {},
  layout = DRAGABLE.LAYOUT.VERTICAL,
  children,
}: DragableListProps<T>) => {
  const onDrop = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      active.id;
      if (over === null) return items;
      const replacedItems = replaceOrderById(
        items,
        active.id as string,
        over.id as string
      );
      onDropCallback(replacedItems);
    },
    [items, onDropCallback]
  );

  const onDrag = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      onDragCallback(active.id as string);
    },
    [onDropCallback]
  );

  const [style, strategy] = useMemo(() => {
    switch (layout) {
      case DRAGABLE.LAYOUT.VERTICAL:
        return [styles.verical, verticalListSortingStrategy];
      case DRAGABLE.LAYOUT.HORIZONTAL:
        return [styles.horizontal, horizontalListSortingStrategy];
      case DRAGABLE.LAYOUT.GRID:
        return [styles.grid, rectSortingStrategy];
      default:
        return [undefined, undefined];
    }
  }, [layout]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDrop}
      onDragStart={onDrag}
    >
      <SortableContext items={items} strategy={strategy}>
        <ul css={style}>{children}</ul>
      </SortableContext>
    </DndContext>
  );
};

DragAbleList.displayName = "DragableList";

/**
 * ドラッグ可能なアイテム、DragableListの中で使用する。
 * childrenにはDragableHandleを含む必要がある。
 */
export const DragableItem: FC<{
  /** アイテムのID、同リスト内でユニークにする必要がある */
  id: string;
}> = ({ id, children }) => {
  const args = { id, resizeObserverConfig: {} };
  const { setNodeRef, transform, transition, isDragging } = useSortable(args);
  const style = useMemo(() => {
    return styles.item({
      isDragging,
      transform: CSS.Transform.toString(transform),
      transition,
    });
  }, [transform, transition, isDragging]);
  return (
    <div css={style} ref={setNodeRef}>
      {children}
    </div>
  );
};
DragableItem.displayName = "DragableItem";

/**
 * ドラッグ操作を行うDOM、DragableItemの中で使用する。
 * idは親のDragableItemと一致している必要がある
 */
export const DragableHandle: FC<{
  /** アイテムのID、同リスト内でユニークにする必要がある */
  id: string;
}> = ({ id, children }) => {
  const args = { id, resizeObserverConfig: {} };
  const { attributes, listeners } = useSortable(args);
  return (
    <div css={styles.handle} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
DragableHandle.displayName = "DragableHandle";

/**
 * ドラッグ中のアイテムをコピーして、UI上わかりやすくする
 */
export const DummyDragedItem: FC<{
  /** 移動中のアイテムのID */
  id?: string | null;
}> = ({ id, children }) => {
  return <DragOverlay>{id ? children : null}</DragOverlay>;
};

type Option<T extends HasStringId> = Pick<
  DragableListProps<T>,
  "onDragCallback" | "onDropCallback"
>;

/**
 * DummyDragedItemに必要な処理の取得
 */
export const useDraged = <T extends HasStringId>(
  /** 対象となるアイテム群 */
  items: T[],
  /**
   * オプション
   * onDropCallback: 本来のonDropCallback(DragableList用)があれば指定
   * onDragCallback: 本来のonDragCallback(DragableList用)があれば指定
   */
  option?: Option<T>
) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeItem = useMemo(() => {
    if (activeId === null) return undefined;
    return items[getIndexById<T>(items, activeId)];
  }, [items, activeId]);

  const wrappedOnDropCallback = useCallback(
    (items: T[]) => {
      if (option?.onDropCallback) option.onDropCallback(items);
      setActiveId(null);
    },
    [option]
  );

  const wrappedOnDragCallback = useCallback(
    (activeId: string) => {
      if (option?.onDragCallback) option.onDragCallback(activeId);
      setActiveId(activeId);
    },
    [option]
  );

  return {
    /** ドラッグ中のアイテム */
    activeItem,
    /** ドラッグ状態の管理を追加したonDropCallback */
    wrappedOnDropCallback,
    /** ドラッグ状態の管理を追加したonDragCallback */
    wrappedOnDragCallback,
  };
};

export default DragAbleList;
