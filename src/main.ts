import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
// import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  // global logger
  // const app = await NestFactory.create(AppModule, {
  //   bufferLogs: true,
  // });
  // app.useLogger(app.get(LoggerService));
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
