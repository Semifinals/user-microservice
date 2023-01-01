import {
  Container,
  CosmosClient,
  PatchOperation,
  RequestOptions,
  Resource,
  SqlQuerySpec
} from "@azure/cosmos"
import { Injectable } from "@nestjs/common"

@Injectable()
export default class CosmosService {
  public static readonly databaseName: string = `semifinals-db`

  public readonly client: CosmosClient = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY
  })

  /**
   * Get the container to be accessed in a database query.
   *
   * @param containerName The name of the container to access
   * @param partitionKeyPath The partition key path of the container
   * @returns The container
   */
  public async getContainer(
    containerName: string,
    partitionKey: string
  ): Promise<Container> {
    // Get database
    const { database } = await this.client.databases.createIfNotExists({
      id: CosmosService.databaseName
    })

    // Get container
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
      partitionKey: {
        paths: [partitionKey]
      }
    })

    // Return container
    return container
  }

  /**
   * Submit a query to the given container.
   *
   * @param container The container to query
   * @param querySpec The query to submit
   * @returns The result of the query on the container
   */
  public async query<T = any>(
    container: Container,
    querySpec: string | SqlQuerySpec
  ): Promise<T[]> {
    const { resources } = await container.items.query(querySpec).fetchAll()
    return resources
  }

  /**
   * Get a specific item from the given container.
   *
   * @param container The container to get from
   * @param id The ID of the item to get
   * @param partitionKeyValue The partition key value of the item
   * @returns The requested item
   */
  public async getItem<T = any>(
    container: Container,
    id: string,
    partitionKeyValue: string
  ): Promise<T & Resource> {
    const { resource } = await container.item(id, partitionKeyValue).read()
    return resource
  }

  /**
   * Create a new item in the given container.
   *
   * @param container The container to create the item in
   * @param data The item to create
   * @param options Request options for creating the item
   * @returns The created item
   */
  public async createItem<T = any>(
    container: Container,
    data: T,
    options?: RequestOptions
  ): Promise<T & Resource> {
    const { resource } = await container.items.create<T>(data, options)
    return resource
  }

  /**
   * Upsert an item in the given container.
   *
   * @param container The container to upsert the item in
   * @param data The item to upsert
   * @param options Request options for upserting the item
   * @returns The upserted item
   */
  public async upsertItem<T = any>(
    container: Container,
    data: T,
    options?: RequestOptions
  ): Promise<T & Resource> {
    const { resource } = await container.items.upsert(data, options)
    return resource as T & Resource
  }

  /**
   * Update an item in the given container.
   *
   * @param container The container the item to update is in
   * @param id The ID of the item to update
   * @param partitionKeyValue The partition key value of the item
   * @param operations The operations to make when updating
   * @param condition The patch condition
   * @param options Request options for updating the item
   * @returns The resulting item after being updated
   */
  public async updateItem<T = any>(
    container: Container,
    id: string,
    partitionKeyValue: string,
    operations: PatchOperation[],
    condition?: string,
    options?: RequestOptions
  ): Promise<T & Resource> {
    const { resource } = await container
      .item(id, partitionKeyValue)
      .patch<T>({ operations, condition }, options)
    return resource
  }

  /**
   * Delete a specific item from the given container.
   *
   * @param container The container to delete from
   * @param id The ID of the item to delete
   * @param partitionKeyValue The partition key value of the item
   * @returns A boolean representing if the delete operation was successful
   */
  public async deleteItem(
    container: Container,
    id: string,
    partitionKeyValue: string
  ): Promise<boolean> {
    const { statusCode } = await container.item(id, partitionKeyValue).delete()
    return statusCode === 204
  }
}
