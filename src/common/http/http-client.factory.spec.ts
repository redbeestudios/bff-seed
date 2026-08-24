import { HttpClientFactory } from "./http-client.factory";

describe("HttpClientFactory", () => {
  it("creates an Axios instance with the given base config", () => {
    const factory = new HttpClientFactory();
    const client = factory.create({
      baseURL: "http://localhost:8080",
      timeout: 5000,
    });

    expect(client.defaults.baseURL).toBe("http://localhost:8080");
    expect(client.defaults.timeout).toBe(5000);
  });

  it("registers a response interceptor that logs and rethrows errors", async () => {
    const factory = new HttpClientFactory();
    const client = factory.create();

    const error = {
      config: { method: "get", baseURL: "http://x", url: "/y" },
      message: "boom",
    };
    const rejectedHandler = (client.interceptors.response as any).handlers[0]
      .rejected;

    await expect(rejectedHandler(error)).rejects.toBe(error);
  });
});
