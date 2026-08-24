import { PaginationUtils } from "./pagination.utils";

describe("PaginationUtils", () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  describe("paginate", () => {
    it("returns the requested page with defaults", () => {
      const result = PaginationUtils.paginate(items, {});

      expect(result.data).toEqual(items.slice(0, 10));
      expect(result.total).toBe(25);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.pages).toBe(3);
    });

    it("returns a later page", () => {
      const result = PaginationUtils.paginate(items, { page: 3, pageSize: 10 });

      expect(result.data).toEqual([21, 22, 23, 24, 25]);
    });

    it("throws for an invalid page", () => {
      expect(() => PaginationUtils.paginate(items, { page: 0 })).toThrow();
    });

    it("throws for an invalid page size", () => {
      expect(() => PaginationUtils.paginate(items, { pageSize: 0 })).toThrow();
    });
  });

  describe("getPaginationMetadata", () => {
    it("computes metadata without slicing data", () => {
      const meta = PaginationUtils.getPaginationMetadata(25, {
        page: 2,
        pageSize: 10,
      });

      expect(meta).toEqual({ total: 25, page: 2, pageSize: 10, pages: 3 });
    });
  });

  describe("getExternalApiPaginationParams", () => {
    it("maps to standard format", () => {
      expect(
        PaginationUtils.getExternalApiPaginationParams(
          { page: 2, pageSize: 10 },
          "standard",
        ),
      ).toEqual({ page: 2, pageSize: 10 });
    });

    it("maps to offset format", () => {
      expect(
        PaginationUtils.getExternalApiPaginationParams(
          { page: 2, pageSize: 10 },
          "offset",
        ),
      ).toEqual({ offset: 10, limit: 10 });
    });

    it("maps to limit/skip format", () => {
      expect(
        PaginationUtils.getExternalApiPaginationParams(
          { page: 2, pageSize: 10 },
          "limit",
        ),
      ).toEqual({ limit: 10, skip: 10 });
    });
  });
});
