import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import configure from "./config/app.config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  configure(app)
  await app.listen(80)
}
bootstrap()
