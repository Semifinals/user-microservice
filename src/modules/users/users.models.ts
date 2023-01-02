import { IsBoolean, IsOptional, IsString } from "class-validator"

export default class User {
  id: string

  @IsString()
  username: string

  @IsBoolean()
  verified: boolean

  @IsString()
  @IsOptional()
  region?: string
}
