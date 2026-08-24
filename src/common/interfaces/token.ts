import { UserInfoDto } from "../dto/auth.dto";

export interface RequestWithUser extends Request {
  user: UserInfoDto;
}
