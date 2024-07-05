import type { ClientApplication } from "@shopify/app-bridge";
import { userLoggedInFetch } from "./APIUtils";

export class BaseAPI {
  protected fetch: ReturnType<typeof userLoggedInFetch>;

  constructor(app: ClientApplication) {
    this.fetch = userLoggedInFetch(app);
  }
}
