import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts, ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

type LoaderData = {
  SHOPIFY_API_KEY: string;
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY || "",
  });
};

export default function App() {
  const { SHOPIFY_API_KEY } = useLoaderData();
  return (
    <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="pviewport" content="width=device-width,initial-scale=1" />
      <link rel="preconnect" href="https://cdn.shopify.com/" />
      <link
        rel="stylesheet"
        href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
      />
      <meta name="shopify-api-key" content={SHOPIFY_API_KEY} />
      <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
      <Meta />
      <Links />
    </head>
    <body>
    <Outlet />
    <ScrollRestoration />
    <Scripts />
    </body>
    </html>
  );
}
