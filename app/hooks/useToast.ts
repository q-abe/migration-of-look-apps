import type { Payload } from "@shopify/app-bridge/actions/Toast";

export const ToastContent = {
  saveGallery: `ギャラリーを保存しました`,
  copyGallery: (title: string) => `${title}を作成しました`,
  addLookToGallery: `ギャラリーにルックを追加しました`,
  createLook: (count: number) => `ルックを${count}個作成しました`,
} as const;

export const useToast = () => {
  const showToast = ({ content, duration = 3000, isError, onDismiss, }: Partial<Omit<Payload, "message">> & { content: string; }) => {
    shopify.toast.show('Product saved', { content, duration, isError, onDismiss});
  };

  return { showToast };
};
