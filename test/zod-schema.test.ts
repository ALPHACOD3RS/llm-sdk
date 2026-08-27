import { describe, expect, it } from "vitest";
import { isZodLike, toJsonSchema } from "../src/adapters/zod-schema.js";

const v3 = {
  string: (description?: string) => ({ _def: { typeName: "ZodString" }, description }),
  number: () => ({ _def: { typeName: "ZodNumber" } }),
  optional: (inner: unknown) => ({ _def: { typeName: "ZodOptional", innerType: inner } }),
  array: (inner: unknown) => ({ _def: { typeName: "ZodArray", type: inner } }),
  enum: (values: string[]) => ({ _def: { typeName: "ZodEnum", values } }),
  object: (shape: Record<string, unknown>, description?: string) => ({
    _def: { typeName: "ZodObject" },
    shape,
    description,
  }),
};

const v4 = {
  string: () => ({ def: { type: "string" } }),
  object: (shape: Record<string, unknown>) => ({ def: { type: "object" }, shape }),
  array: (inner: unknown) => ({ def: { type: "array", element: inner } }),
};

describe("isZodLike", () => {
  it("recognizes v3 and v4 shapes", () => {
    expect(isZodLike(v3.string())).toBe(true);
    expect(isZodLike(v4.string())).toBe(true);
  });

  it("rejects plain JSON Schema and undefined", () => {
    expect(isZodLike({ type: "string" })).toBe(false);
    expect(isZodLike(undefined)).toBe(false);
  });
});

describe("toJsonSchema", () => {
  it("passes plain JSON Schema through unchanged", () => {
    const raw = { type: "object", properties: { city: { type: "string" } } };
    expect(toJsonSchema(raw)).toBe(raw);
  });

  it("defaults undefined to a permissive object schema", () => {
    expect(toJsonSchema(undefined)).toEqual({ type: "object", properties: {} });
  });

  it("converts a v3 object schema with required and optional fields", () => {
    const schema = v3.object(
      {
        city: v3.string("City name"),
        country: v3.optional(v3.string()),
      },
      "Location",
    );

    expect(toJsonSchema(schema)).toEqual({
      type: "object",
      description: "Location",
      properties: {
        city: { type: "string", description: "City name" },
        country: { type: "string" },
      },
      required: ["city"],
    });
  });

  it("converts a v3 array and enum", () => {
    expect(toJsonSchema(v3.array(v3.string()))).toEqual({
      type: "array",
      items: { type: "string" },
    });
    expect(toJsonSchema(v3.enum(["a", "b"]))).toEqual({ enum: ["a", "b"] });
  });

  it("converts v4 object and array shapes", () => {
    const schema = v4.object({ tags: v4.array(v4.string()) });
    expect(toJsonSchema(schema)).toEqual({
      type: "object",
      properties: { tags: { type: "array", items: { type: "string" } } },
      required: ["tags"],
    });
  });

  it("falls back to a permissive schema for unrecognized zod kinds", () => {
    expect(toJsonSchema({ _def: { typeName: "ZodPromise" } })).toEqual({});
  });
});
