import { DeleteIcon, DragHandleIcon } from '@shopify/polaris-icons';
import type { ComponentProps, FC} from "react";
import React, { useCallback } from "react";
import {
  Button, Card,
  Icon, InlineStack,
  ResourceItem,
  Thumbnail,
  Tooltip,
} from "@shopify/polaris";
import type { HasStringId } from '../../../Documents/Project/Q/public-look-app/src/helpers/drag';
import DragAbleList, {
  DragableItem,
  DragableHandle,
  DummyDragedItem,
  useDraged,
} from "./DragableList/DragableList";
import { css } from "@emotion/react";

export type Product = {
  id: string;
  title: string;
  handle: string;
  src: string;
};

const DragAbleProductList: FC<{
  items: Product[];
  onDropCallback: (items: Product[]) => void;
  onClickDeleteCallback?: ComponentProps<
    typeof ProductItem
  >["onClickDeleteCallback"];
}> = ({
  items,
  onDropCallback = (items: HasStringId[]) => {},
  onClickDeleteCallback,
}) => {
  const { activeItem, wrappedOnDropCallback, wrappedOnDragCallback } =
    useDraged<Product>(items, { onDropCallback });

  return (
    <Card>
      <DragAbleList
        items={items}
        onDropCallback={wrappedOnDropCallback}
        onDragCallback={wrappedOnDragCallback}
      >
        {items.map((item) => (
          <DragableItem key={`${item.id}${item.title}item`} id={item.id}>
            <ProductItem
              item={item}
              onClickDeleteCallback={onClickDeleteCallback}
            />
          </DragableItem>
        ))}
        {activeItem ? (
          <DummyDragedItem id={activeItem?.id}>
            <ProductItem
              item={activeItem}
              onClickDeleteCallback={onClickDeleteCallback}
            />
          </DummyDragedItem>
        ) : null}
      </DragAbleList>
    </Card>
  );
};

DragAbleProductList.displayName = "DragAbleProductList";

const ProductItem: FC<{
  item: Product;
  onClickDeleteCallback?: (id: string) => void;
}> = ({ item, onClickDeleteCallback = (id: string) => {} }) => {
  const onClickDelete = useCallback(() => {
    onClickDeleteCallback(item.id);
  }, [item, onClickDeleteCallback]);

  return (
    <ResourceItem id={item.id} url="">
      <InlineStack alignment="center">
        <InlineStack.Item>
          <DragableHandle id={item.id}>
            <Tooltip
              content="ドラッグ&ドロップで順序を入れ替えます"
              dismissOnMouseOut
            >
              <Icon source={DragHandleIcon} />
            </Tooltip>
          </DragableHandle>
        </InlineStack.Item>
        <InlineStack.Item>
          {item.src ? (
            <Thumbnail source={item.src} alt={item.title} />
          ) : (
            <div
              css={css`
                width: 60px;
                height: 60px;
                background: #eee;
              `}
            />
          )}
        </InlineStack.Item>
        <Stack.Item fill>
          <Heading>{item.title}</Heading>
        </Stack.Item>
        <Stack.Item>
          <Tooltip content="選択肢から削除します" dismissOnMouseOut>
            <Button
              onClick={onClickDelete}
              plain
              icon={<Icon source={DeleteIcon} />}
            />
          </Tooltip>
        </Stack.Item>
      </InlineStack>
    </ResourceItem>
  );
};

export default DragAbleProductList;
