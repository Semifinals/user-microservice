import { OmitType, PartialType } from "@nestjs/mapped-types"
import { IsString } from "class-validator"
import User from "./users.models"

export class CreateUserDto extends OmitType(User, ["id"] as const) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class GetUserParams {
  @IsString()
  id: string
}

export class UpdateUserParams {
  @IsString()
  id: string
}

export class DeleteUserParams {
  @IsString()
  id: string
}
