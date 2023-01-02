import { PatchOperation } from "@azure/cosmos"
import { Injectable } from "@nestjs/common"
import * as shortid from "shortid"
import CosmosService from "src/services/cosmos.service"
import User from "./users.models"
import { CreateUserDto, UpdateUserDto } from "./users.params"

@Injectable()
export default class UserService {
  public constructor(private readonly cosmosService: CosmosService) {}

  public async create(dto: CreateUserDto) {
    const container = await this.cosmosService.getContainer("users", "/id")
    return this.cosmosService.createItem<User>(container, {
      ...dto,
      id: shortid.generate()
    })
  }

  public async read(id: string) {
    const container = await this.cosmosService.getContainer("users", "/id")

    // Attempt to get the user
    const user = await this.cosmosService.getItem<User>(container, id, id)
    if (!user) throw new Error()

    // Return the fetched user
    return user
  }

  public async update(id: string, dto: UpdateUserDto) {
    const container = await this.cosmosService.getContainer("users", "/id")

    // Format the dto as patch operations
    function recursivelyGeneratePatchOperations(
      object: object,
      path = "",
      operations: PatchOperation[] = []
    ): PatchOperation[] {
      Object.entries(dto).forEach(([key, value]) => {
        const newPath = `${path}/${key}`

        if (typeof value !== "object") {
          operations.push({
            op: typeof value === "undefined" ? "remove" : "set",
            path: newPath,
            value
          })
        } else {
          return recursivelyGeneratePatchOperations(object, newPath, operations)
        }
      })

      return operations
    }

    const operations = recursivelyGeneratePatchOperations(dto)

    // Return the updated user
    return await this.cosmosService.updateItem(container, id, id, operations)
  }

  public async delete(id: string) {
    const container = await this.cosmosService.getContainer("users", "/id")
    return this.cosmosService.deleteItem(container, id, id)
  }
}
