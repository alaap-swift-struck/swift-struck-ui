// useDebouncedCallback — debounces to one trailing call with the latest args;
// delay <= 0 fires immediately; a restarted timer supersedes the pending call.

import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { useDebouncedCallback } from "./use-debounce"

describe("useDebouncedCallback", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("fires once after the delay, with the latest args", () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 200))
    act(() => {
      result.current("a")
      result.current("b")
    })
    expect(fn).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(200))
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith("b")
  })

  it("fires immediately when delay <= 0", () => {
    const fn = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(fn, 0))
    act(() => result.current("x"))
    expect(fn).toHaveBeenCalledWith("x")
  })
})
