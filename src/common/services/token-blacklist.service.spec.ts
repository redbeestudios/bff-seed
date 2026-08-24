import { TokenBlacklistService } from "./token-blacklist.service";

describe("TokenBlacklistService", () => {
  let service: TokenBlacklistService;

  beforeEach(() => {
    service = new TokenBlacklistService();
  });

  it("blacklists a token and reports it as blacklisted", () => {
    service.addToBlacklist("token-1", "logout");

    expect(service.isBlacklisted("token-1")).toBe(true);
    expect(service.getBlacklistSize()).toBe(1);
  });

  it("removes a token from the blacklist", () => {
    service.addToBlacklist("token-1", "logout");
    service.removeFromBlacklist("token-1");

    expect(service.isBlacklisted("token-1")).toBe(false);
  });

  it("clears the blacklist", () => {
    service.addToBlacklist("token-1", "logout");
    service.addToBlacklist("token-2", "logout");
    service.clearBlacklist();

    expect(service.getBlacklistSize()).toBe(0);
  });

  it("reports blacklist stats", () => {
    service.addToBlacklist("token-1", "logout");

    const stats = service.getBlacklistStats();

    expect(stats.size).toBe(1);
    expect(stats.tokens).toContain("token-1");
  });
});
