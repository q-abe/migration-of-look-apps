import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { TabProps} from "@shopify/polaris";
import { Modal, Tabs } from "@shopify/polaris";
import { LookAPI } from '../../../../Documents/Project/Q/public-look-app/src/api/LookAPI';
import { useAuthenticatedAPI } from '../../hooks/useAuthenticatedAPI';
import { LookCard } from '../../../../Documents/Project/Q/public-look-app/src/types/LookCard';

import LinkProductsForm from "./LinkProductsModal";
import SettingForm from "./SettingForm";
import { css } from "@emotion/react";

type Props = {
  active: boolean;
  lookId?: number;
  loading?: boolean;
  onSave?: (look: LookCard) => void;
  onClose?: () => void;
  hideGalleries?: boolean;
};

type Context = {
  editedLook?: LookCard;
  initializedId?: number;
  initEditedLook?: (look?: LookCard) => void;
  updateEditedLookByKey?: (
    key: keyof LookCard,
    value: LookCard[keyof LookCard]
  ) => void;
};

const tabs = [
  { id: "setting", content: "設定" },
  { id: "products", content: "商品紐付き" },
] as TabProps[];

const EditContext = createContext<Context>({
  editedLook: undefined,
  initializedId: undefined,
  initEditedLook: undefined,
  updateEditedLookByKey: undefined,
});

const useEditProvider = (): Context => {
  const [editedLook, setEditedLook] = useState<LookCard>();
  const [initializedId, setIsInitialized] = useState<number>();

  const updateEditedLookByKey = (
    key: keyof LookCard,
    value: LookCard[keyof LookCard]
  ) => {
    setEditedLook((currentLook) => {
      const newLook = Object.assign({}, currentLook, { [key]: value });
      return newLook;
    });
  };

  const initEditedLook = (look?: LookCard) => {
    setEditedLook(look);
    setIsInitialized(look?.id);
  };

  return {
    editedLook,
    initializedId,
    initEditedLook,
    updateEditedLookByKey,
  };
};

const EditProvider: FC = ({ children }) => {
  const value = useEditProvider();
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};

export const useEdit = () => {
  return useContext(EditContext);
};

export const LookEditModal: FC<Props> = ({
  active,
  lookId,
  loading = false,
  onSave,
  onClose = () => {},
  hideGalleries,
}) => {
  const { initEditedLook } = useEdit();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const lookAPI = useAuthenticatedAPI(LookAPI);

  useEffect(() => {
    if (!lookId) return;

    (async () => {
      setIsLoading(true);
      const look = await lookAPI.getByID(lookId);
      initEditedLook?.(look);
      setIsLoading(false);
    })();
  }, []);

  const onSelectTab = useCallback((selectedTab: number) => {
    setActiveTabIndex(selectedTab);
  }, []);

  const displayStyle = (index: number) => css`
    display: ${index === activeTabIndex ? "block" : "none"};
  `;

  return (
    <Modal title="" open={active} onClose={onClose} loading={loading} large>
      <Tabs tabs={tabs} selected={activeTabIndex} onSelect={onSelectTab} />
      <div Ïcss={displayStyle(0)}>
        <Modal.Section>
          <SettingForm
            isLoading={isLoading}
            hideGalleries={hideGalleries}
            onSave={onSave}
          />
        </Modal.Section>
      </div>
      <div css={displayStyle(1)}>
        <Modal.Section>
          <LinkProductsForm isLoading={isLoading} onSave={onSave} />
        </Modal.Section>
      </div>
    </Modal>
  );
};

export default (props: Props) => (
  <EditProvider>
    <LookEditModal {...props} />
  </EditProvider>
);
