import type { SelectPayload } from '@shopify/app-bridge-core/actions/Picker';
import { ResourcePicker } from '@shopify/app-bridge/actions';
import type {
  DetailedHTMLProps, FC, ImgHTMLAttributes} from "react";
import { useCallback, useEffect, useMemo, useState,
} from "react";
import { css } from "@emotion/react";
import {
  Button, FormLayout, Layout, Spinner, TextField,
} from "@shopify/polaris";
import type { Product as ResourceProduct, ResourceSelection } from "@shopify/app-bridge/actions/ResourcePicker";
import { useModal } from '~/hooks/useModal';
import type { Product } from '../DragAbleProductList';
import DragAbleProductList from '../DragAbleProductList';
import { useEdit } from './LookEditModal';

const parseProductFromGraphQL = (product: ProductOnGraphQL): Product => {
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    src: product?.images?.nodes?.[0]?.originalSrc ?? "",
  };
};

const parseProductFromPayload = (item: ResourceSelection): Product => {
  const product = item as ResourceProduct;
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    src: product?.images?.[0]?.originalSrc ?? "",
  };
};

const LinkProductsForm: FC<{
  isLoading?: boolean;
  onSave?: (look: LookCard) => void;
}> = ({ isLoading = false, onSave }) => {
  const { useApolloClient } = pkg;
  const client = useApolloClient();
  const [activeModal, openModal, closeModal] = useModal();
  const { editedLook, initializedId, updateEditedLookByKey } = useEdit();
  const [inputtedValue, setInputtedValue] = useState<string>("");

  /**
   * 表示用のstate、保存処理にはeditLook.productsを利用する。
   * 不要なqueryの発行を防ぐため、読み込んだ画像のパスなどはここでキャッシュする。
   */
  const [productInfos, setProductInfos] = useState<Product[]>([]);

  /**
   * 初期読み込み時のみ、付属情報をshopifyからfetchする。
   * productsでの複数読み込みはできないので、個別に取得する。
   */
  useEffect(() => {
    if (typeof initializedId === "undefined") return;
    (async () => {
      const productInfoPromises =
        editedLook?.products?.map<Promise<ProductOnGraphQL | undefined>>(
          async (lookProduct) => {
            const result = await client.query<{ product: ProductOnGraphQL }>({
              query: GET_PRODUCT_BY_ID,
              variables: {
                id: lookProduct.productId,
              },
            });
            return result.data.product;
          }
        ) ?? [];
      const productInfos = await Promise.all(productInfoPromises);

      setProductInfos(
        productInfos
          .filter(
            (product): product is Product => typeof product !== "undefined"
          )
          .map(parseProductFromGraphQL)
      );
    })();
  }, [initializedId]);

  /**
   * Product情報のキャッシュ更新
   */
  const updateProductInfos = (productInfos: Product[]) => {
    setProductInfos((currentProductInfos) => {
      const keepProductInfos = currentProductInfos.filter(
        (currentProductInfo) => {
          return productInfos.every(
            (productInfo) => productInfo.id !== currentProductInfo.id
          );
        }
      );
      return [...keepProductInfos, ...productInfos];
    });
  };

  const selectedProducts = useMemo(() => {
    return (
      editedLook?.products?.map((lookProduct) => {
        const displayProduct = productInfos.find(
          (productInfo) => productInfo.id === lookProduct.productId
        ) ?? {
          id: lookProduct.productId,
          title: "Loading now...",
          src: "",
          handle: "",
        };
        return displayProduct;
      }) ?? []
    );
  }, [editedLook, productInfos]);

  const onClickSave = useCallback(() => {
    if (typeof editedLook === "undefined") return;
    onSave?.(editedLook);
  }, [onSave, editedLook]);

  const sortProducts = useCallback((products: Product[]) => {
    const lookProducts = products.map((product) => {
      return { productId: product.id, productHandle: product.handle };
    });
    updateProductInfos(products);
    updateEditedLookByKey?.("products", lookProducts);
  }, []);

  const changeProducts = useCallback(
    (payload: SelectPayload) => {
      const lookProducts = payload.selection.map((item) => {
        const _item = item as ResourceProduct;
        return { productId: _item.id, productHandle: _item.handle };
      });
      // 選択済みの商品の順序は変えず、新しい商品は下に追加する。
      const newCoproducts = lookProducts.filter((lookProduct) => {
        return editedLook?.products?.every((product) => {
          return product.productId !== lookProduct.productId;
        });
      });

      updateProductInfos(payload.selection.map(parseProductFromPayload));
      updateEditedLookByKey?.("products", [
        ...(editedLook?.products ?? []),
        ...newCoproducts,
      ]);
      closeModal();
    },
    [editedLook?.products]
  );

  const onClickDelete = useCallback(
    (id: string) => {
      const lookProducts = editedLook?.products?.filter(
        (lookProduct) => id !== lookProduct.productId
      );
      updateProductInfos(productInfos.filter((product) => product.id !== id));
      updateEditedLookByKey?.("products", lookProducts);
    },
    [editedLook, productInfos]
  );

  if (isLoading) {
    return (
      <FormLayout>
        <Spinner />
      </FormLayout>
    );
  }

  return (
    <>
      <Layout>
        <Layout.Section secondary>
          <FormLayout>
            <HotPointCanvas
              src={editedLook?.mediaUrl}
              alt={editedLook?.title}
            />
            <Button onClick={onClickSave} primary>
              保存する
            </Button>
          </FormLayout>
        </Layout.Section>
        <Layout.Section>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label=""
                value={inputtedValue}
                autoComplete="off"
                onChange={setInputtedValue}
              />
              <Button onClick={openModal} outline>
                検索
              </Button>
            </FormLayout.Group>
            <DragAbleProductList
              items={selectedProducts}
              onDropCallback={sortProducts}
              onClickDeleteCallback={onClickDelete}
            />
          </FormLayout>
        </Layout.Section>
      </Layout>
      <ResourcePicker
        open={activeModal}
        resourceType="Product"
        initialQuery={inputtedValue}
        initialSelectionIds={selectedProducts}
        showVariants={false}
        selectMultiple
        onCancel={closeModal}
        onSelection={changeProducts}
      />
    </>
  );
};

const imgStyle = css`
  width: 100%;
  object-fit: cover;
`;

const HotPointCanvas: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = (props) => <img css={imgStyle} {...props} />;

export default LinkProductsForm;
