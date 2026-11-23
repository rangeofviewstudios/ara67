import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@config";

export const { POST, GET } = makeRouteHandler({ config });
