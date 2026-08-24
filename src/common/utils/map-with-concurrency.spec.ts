import { mapWithConcurrency } from "./map-with-concurrency";

describe("mapWithConcurrency", () => {
  it("returns an empty array for an empty input", async () => {
    const result = await mapWithConcurrency([], 2, async (n) => n);
    expect(result).toEqual([]);
  });

  it("resolves items in order with results", async () => {
    const items = [1, 2, 3, 4, 5];
    const result = await mapWithConcurrency(items, 2, async (n) => n * 2);

    expect(
      result.map((r) => (r as PromiseFulfilledResult<number>).value),
    ).toEqual([2, 4, 6, 8, 10]);
  });

  it("never runs more than `limit` workers at once", async () => {
    let active = 0;
    let maxActive = 0;

    await mapWithConcurrency([1, 2, 3, 4, 5, 6], 2, async (n) => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active--;
      return n;
    });

    expect(maxActive).toBeLessThanOrEqual(2);
  });

  it("captures individual rejections without failing the batch", async () => {
    const result = await mapWithConcurrency([1, 2, 3], 3, async (n) => {
      if (n === 2) throw new Error("boom");
      return n;
    });

    expect(result[0].status).toBe("fulfilled");
    expect(result[1].status).toBe("rejected");
    expect(result[2].status).toBe("fulfilled");
  });
});
