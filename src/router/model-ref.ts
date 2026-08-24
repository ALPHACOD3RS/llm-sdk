import { BadRequest } from "../errors.js";
import type { ModelRef } from "../types.js";
import type { ParsedModel } from "./types.js";

/** Split `"provider/model"`. */
export function parseModelRef(ref: ModelRef): ParsedModel {
  const slash = ref.indexOf("/");
  if (slash <= 0 || slash === ref.length - 1) {
    throw new BadRequest(`Invalid model ref "${ref}". Expected "provider/model".`);
  }
  return {
    provider: ref.slice(0, slash),
    model: ref.slice(slash + 1),
    ref,
  };
}
