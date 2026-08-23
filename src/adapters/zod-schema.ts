/** Best-effort Zod → JSON Schema (no zod dependency). Unrecognized types → `{}`. */

interface ZodLike {
  _def?: Record<string, unknown>;
  def?: Record<string, unknown>;
  shape?: Record<string, unknown>;
  description?: string;
}

interface ZodInfo {
  kind: string;
  def: Record<string, unknown>;
  legacy: boolean;
}

function zodInfo(schema: unknown): ZodInfo | undefined {
  const s = schema as ZodLike;
  if (s?._def && typeof s._def.typeName === "string") {
    return { kind: s._def.typeName.replace(/^Zod/, "").toLowerCase(), def: s._def, legacy: true };
  }
  if (s?.def && typeof s.def.type === "string") {
    return { kind: s.def.type.toLowerCase(), def: s.def, legacy: false };
  }
  return undefined;
}

export function isZodLike(schema: unknown): boolean {
  return zodInfo(schema) !== undefined;
}

function withDescription(schema: Record<string, unknown>, description?: string): Record<string, unknown> {
  return description ? { ...schema, description } : schema;
}

function isOptionalField(field: unknown): boolean {
  const info = zodInfo(field);
  return info?.kind === "optional" || info?.kind === "default";
}

function zodToJsonSchema(schema: unknown): Record<string, unknown> {
  const s = schema as ZodLike;
  const info = zodInfo(schema);
  if (!info) return withDescription({}, s?.description);
  const { kind, def, legacy } = info;

  switch (kind) {
    case "string":
      return withDescription({ type: "string" }, s.description);
    case "number":
      return withDescription({ type: "number" }, s.description);
    case "boolean":
      return withDescription({ type: "boolean" }, s.description);
    case "bigint":
    case "int":
      return withDescription({ type: "integer" }, s.description);
    case "date":
      return withDescription({ type: "string", format: "date-time" }, s.description);
    case "literal": {
      const value = legacy ? def.value : (def.values as unknown[] | undefined)?.[0];
      return withDescription({ const: value }, s.description);
    }
    case "enum": {
      const raw = legacy ? def.values : (def.entries ?? def.options);
      const list = Array.isArray(raw) ? raw : Object.values((raw as Record<string, unknown>) ?? {});
      return withDescription({ enum: list }, s.description);
    }
    case "array": {
      const item = legacy ? def.type : def.element;
      return withDescription({ type: "array", items: zodToJsonSchema(item) }, s.description);
    }
    case "object": {
      const shape = s.shape ?? {};
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
      for (const [key, field] of Object.entries(shape)) {
        properties[key] = zodToJsonSchema(field);
        if (!isOptionalField(field)) required.push(key);
      }
      return withDescription(
        { type: "object", properties, ...(required.length > 0 ? { required } : {}) },
        s.description,
      );
    }
    case "optional":
    case "nullable":
    case "default":
    case "catch":
      return zodToJsonSchema(def.innerType);
    default:
      return withDescription({}, s.description);
  }
}

/** Zod → JSON Schema; non-Zod values pass through as JSON Schema. */
export function toJsonSchema(schema: unknown): unknown {
  if (schema === undefined) return { type: "object", properties: {} };
  return isZodLike(schema) ? zodToJsonSchema(schema) : schema;
}
