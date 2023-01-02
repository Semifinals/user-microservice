import { Module, ValidationPipe } from "@nestjs/common"
import { APP_PIPE } from "@nestjs/core"
import AppController from "./app.controller"
import AppService from "./app.service"
import UserModule from "./modules/users/users.module"

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe()
    }
  ]
})
export default class AppModule {}
