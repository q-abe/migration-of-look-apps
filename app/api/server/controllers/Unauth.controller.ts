import { Request, Response } from "express";
import { Shopify } from "@shopify/shopify-api";

import { getIdParam } from "../helpers/request.js";

import { GalleryService } from "../services/Gallery.service.js";

/**
 * Jsonpで返したい場合に利用するクラス
 */
export class UnauthController {
  static getGalleryById = async (req: Request, res: Response) => {
    const id = getIdParam(req) as number;
    const gallery = await GalleryService.getByIdWithoutMedia(id);

    if (gallery) {
      res.status(200).jsonp(gallery);
    } else {
      res.status(404).send("404 - Not found");
    }
  };

  static getProducts = async (req: Request, res: Response) => {
    const id = getIdParam(req) as number;
    const session = await Shopify.Utils.loadOfflineSession(
      process.env.SHOP ?? ""
    );

    if (session?.isActive()) {
      try {
        const client = new Shopify.Clients.Graphql(
          session.shop,
          session.accessToken
        );
        const { body } = (await client.query({
          data: `{
            product(id: "gid://shopify/Product/${id}") {
              metafield(namespace: "product_extra", key: "comingsoon_text") {
                value
              }
            }
          }`,
        })) as { body: { data: any } };
        res.status(200).jsonp(body.data);
        return;
      } catch (e) {
        if (
          e instanceof Shopify.Errors.HttpResponseError &&
          e.response.code === 401
        ) {
          // We only want to catch 401s here, anything else should bubble up
        } else {
          throw e;
        }
      }
    }

    res.status(404).send("404 - Not found");
  };
}
