/**
 * Example permission set, meant to be carried as a JWT claim.
 * Replace with the permissions your domain actually needs.
 */
export enum Permission {
  READ = "read",
  WRITE = "write",
  MANAGE = "manage",
}
