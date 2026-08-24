export interface ITokenConfig {
  jwtSecret: string;
  jwtExpiration: string;
  refreshTokenExpiration: string;
}

export interface IApp {
  port: number;
  tokenConfig: ITokenConfig;
}

export enum EnvObjects {
  PORT = "port",
  TOKEN_CONFIG = "tokenConfig",
}

export const appConfig = (): IApp => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  tokenConfig: {
    jwtSecret: process.env.JWT_SECRET || "defaultSecret",
    jwtExpiration: process.env.JWT_EXPIRATION || "3600",
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || "604800",
  },
});
