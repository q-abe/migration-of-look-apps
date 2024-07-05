import type { ShopifyGlobal} from '@shopify/app-bridge-react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useMemo } from "react";

export const useAuthenticatedAPI = <T>(API: {
  new(app: ShopifyGlobal): T;
}) => {
  const app = useAppBridge();
  return useMemo(() => new API(app), [app]);
};
