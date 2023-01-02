import { Module } from "@nestjs/common"
import CosmosService from "src/services/cosmos.service"
import AppController from "./users.controller"
import AppService from "./users.service"

@Module({
  controllers: [AppController],
  providers: [AppService, CosmosService]
})
export default class UserModule {}
