type Plain = Record<string, unknown>;

export function isPlainObject(value: unknown): value is Plain {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Overlay defined leaves from `override` onto a deep clone of `base`.
 * Empty strings / null / undefined in `override` are ignored so they never blank
 * out a default. Arrays replace wholesale.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  const result = structuredClone(base);
  if (!isPlainObject(override)) return result;
  mergeInto(result as unknown as Plain, override);
  return result;
}

function mergeInto(target: Plain, override: Plain): void {
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined || value === null || value === "") continue;
    const current = target[key];
    if (isPlainObject(value) && isPlainObject(current)) {
      mergeInto(current, value);
    } else {
      target[key] = value;
    }
  }
}
