import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post
} from "@nestjs/common"
import {
  CreateUserDto,
  DeleteUserParams,
  GetUserParams,
  UpdateUserDto,
  UpdateUserParams
} from "./users.params"
import UserService from "./users.service"

@Controller()
export default class UserController {
  public constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user.
   *
   * @param dto The request body
   * @returns The created user
   */
  @Post()
  public async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto)
  }

  /**
   * Gets a specific user.
   *
   * @param params The request params
   * @returns The fetched user
   */
  @Get(":id")
  public async read(@Param() params: GetUserParams) {
    try {
      return await this.userService.read(params.id)
    } catch (err) {
      throw new HttpException(
        { reason: "User does not exist" },
        HttpStatus.NOT_FOUND
      )
    }
  }

  /**
   * Updates a specific user.
   *
   * @param params The request params
   * @param dto The request body
   * @returns The updated user
   */
  @Patch(":id")
  public async update(
    @Param() params: UpdateUserParams,
    @Body() dto: UpdateUserDto
  ) {
    try {
      return await this.userService.update(params.id, dto)
    } catch (err) {
      throw new HttpException(
        { reason: "User does not exist" },
        HttpStatus.NOT_FOUND
      )
    }
  }

  /**
   * Deletes a specific user.
   *
   * @param params The request params
   * @returns Whether or not the delete was successful
   */
  @Delete(":id")
  @HttpCode(204)
  public async delete(@Param() params: DeleteUserParams) {
    const success = await this.userService.delete(params.id)

    if (!success)
      throw new HttpException(
        { reason: "User does not exist" },
        HttpStatus.NOT_FOUND
      )

    return success
  }
}
