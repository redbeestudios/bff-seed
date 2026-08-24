import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class TokenBlacklistService {
  private readonly logger = new Logger(TokenBlacklistService.name);
  private readonly blacklistedTokens = new Set<string>();

  addToBlacklist(token: string, reason: string) {
    this.blacklistedTokens.add(token);
    this.logger.warn(`Token blacklisted: ${reason}`);
  }

  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  removeFromBlacklist(token: string) {
    this.blacklistedTokens.delete(token);
    this.logger.log("Token removed from blacklist");
  }

  getBlacklistSize(): number {
    return this.blacklistedTokens.size;
  }

  clearBlacklist() {
    this.blacklistedTokens.clear();
    this.logger.log("Blacklist cleared");
  }

  getBlacklistStats() {
    return {
      size: this.blacklistedTokens.size,
      tokens: Array.from(this.blacklistedTokens).slice(0, 10),
    };
  }
}
