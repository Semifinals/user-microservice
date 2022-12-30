import { INestApplication } from "@nestjs/common"
import TransformInterceptor from "src/interceptors/transform.interceptor"

/**
 * Configure the nest application in a standard way.
 *
 * @param app The app to configure
 */
export default function configure(app: INestApplication) {
  app.useGlobalInterceptors(new TransformInterceptor())
}
