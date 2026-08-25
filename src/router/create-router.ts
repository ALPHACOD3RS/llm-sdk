import { BadRequest } from "../errors.js";
import type { RouteConfig, RouterConfig } from "../types.js";
import { assertNoConflictingModelFields } from "./options.js";
import { RouterImpl } from "./router-impl.js";
import { RouterState } from "./state.js";
import type { Router } from "./types.js";

export function createRouter<const C extends RouterConfig>(
  config: C,
): Router<C["routes"] extends Record<infer K, RouteConfig> ? Extract<K, string> : string> {
  if (!config.primary && !config.routes) {
    throw new BadRequest("createRouter() requires primary or routes");
  }

  assertNoConflictingModelFields(config, "createRouter() config");
  for (const [name, route] of Object.entries(config.routes ?? {})) {
    assertNoConflictingModelFields(route, `route "${name}"`);
  }

  type RouteNames = C["routes"] extends Record<infer K, RouteConfig> ? Extract<K, string> : string;
  const state = new RouterState(config);
  const router = new RouterImpl<RouteNames>(state);

  if (config.default && config.routes) {
    return router.route(config.default as RouteNames);
  }

  return router;
}
