import { Controller, Get, HttpCode } from "@nestjs/common"
import AppService from "./app.service"

@Controller()
export default class AppController {
  public constructor(private readonly appService: AppService) {}

  /**
   * Return successful no content to verify the microservice is online.
   */
  @Get("/ping")
  @HttpCode(204)
  public async ping(): Promise<void> {}
}
