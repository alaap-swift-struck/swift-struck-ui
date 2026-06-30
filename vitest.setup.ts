// Test setup: unmount React trees after each test so DOM assertions don't leak,
// and polyfill the handful of browser APIs jsdom is missing that Radix UI
// primitives (Select, AspectRatio, Dropdown) touch on mount.
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

afterEach(() => {
  cleanup()
})

if (typeof window !== "undefined") {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error - test shim
  window.ResizeObserver = window.ResizeObserver || RO
  // @ts-expect-error - test shim
  window.matchMedia =
    window.matchMedia ||
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
    }))
  if (!Element.prototype.scrollIntoView)
    Element.prototype.scrollIntoView = () => {}
  if (!Element.prototype.hasPointerCapture)
    // @ts-expect-error - test shim
    Element.prototype.hasPointerCapture = () => false
  if (!Element.prototype.releasePointerCapture)
    // @ts-expect-error - test shim
    Element.prototype.releasePointerCapture = () => {}
}
