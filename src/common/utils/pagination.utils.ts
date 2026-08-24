export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export class PaginationUtils {
  static paginate<T>(
    items: T[],
    params: PaginationParams,
  ): PaginationResult<T> {
    const page = params.page !== undefined ? params.page : 1;
    const pageSize = params.pageSize !== undefined ? params.pageSize : 10;

    if (page < 1) {
      throw new Error("Page must be a number greater than or equal to 1");
    }

    if (pageSize < 1) {
      throw new Error("Page size must be a number greater than or equal to 1");
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / pageSize);

    return {
      data: paginatedItems,
      total: items.length,
      page,
      pageSize,
      pages: totalPages,
    };
  }

  static getPaginationMetadata(
    totalItems: number,
    params: PaginationParams,
  ): Omit<PaginationResult<any>, "data"> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      total: totalItems,
      page,
      pageSize,
      pages: totalPages,
    };
  }

  static getExternalApiPaginationParams(
    params: PaginationParams,
    format: "standard" | "offset" | "limit" = "standard",
  ): Record<string, number> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    switch (format) {
      case "standard":
        return { page, pageSize };
      case "offset":
        return {
          offset: (page - 1) * pageSize,
          limit: pageSize,
        };
      case "limit":
        return {
          limit: pageSize,
          skip: (page - 1) * pageSize,
        };
    }
  }
}
