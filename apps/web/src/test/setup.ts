import "@testing-library/jest-dom/vitest";

if (typeof URL.createObjectURL !== "function") {
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:ghibli-test-preview"),
    writable: true,
  });
}

if (typeof URL.revokeObjectURL !== "function") {
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
    writable: true,
  });
}
