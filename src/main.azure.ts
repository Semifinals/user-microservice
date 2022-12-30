import { INestApplication } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import configure from "./config/app.config"

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix("/")
  configure(app)

  await app.init()
  return app
}
