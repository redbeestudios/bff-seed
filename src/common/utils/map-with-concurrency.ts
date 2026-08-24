export async function mapWithConcurrency<TIn, TOut>(
  items: readonly TIn[],
  limit: number,
  worker: (item: TIn, index: number) => Promise<TOut>,
): Promise<PromiseSettledResult<TOut>[]> {
  if (items.length === 0) {
    return [];
  }

  const safeLimit = Math.max(1, Math.floor(limit));
  const results: PromiseSettledResult<TOut>[] = new Array(items.length);

  for (let start = 0; start < items.length; start += safeLimit) {
    const chunk = items.slice(start, start + safeLimit);
    const settled = await Promise.allSettled(
      chunk.map((item, offset) => worker(item, start + offset)),
    );
    settled.forEach((result, offset) => {
      results[start + offset] = result;
    });
  }

  return results;
}
