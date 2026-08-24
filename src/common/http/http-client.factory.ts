import { Injectable, Logger } from "@nestjs/common";
import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

/**
 * Creates pre-configured Axios instances for calling upstream services.
 * Add cross-cutting request/response behavior here (tracing headers,
 * retries, auth propagation) so every upstream client picks it up.
 */
@Injectable()
export class HttpClientFactory {
  private readonly logger = new Logger(HttpClientFactory.name);

  create(config: CreateAxiosDefaults = {}): AxiosInstance {
    const instance = axios.create(config);

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const method = error.config?.method?.toUpperCase();
        const url = `${error.config?.baseURL ?? ""}${error.config?.url ?? ""}`;
        this.logger.warn(
          `Upstream request failed: ${method} ${url} — ${error.message}`,
        );
        return Promise.reject(error);
      },
    );

    return instance;
  }
}
