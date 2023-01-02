import { INestApplication } from "@nestjs/common"
import HttpExceptionFilter from "src/interceptors/exception.filter"
import TransformInterceptor from "src/interceptors/transform.interceptor"

/**
 * Configure the nest application in a standard way.
 *
 * @param app The app to configure
 */
export default function configure(app: INestApplication) {
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
}
