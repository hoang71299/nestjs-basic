import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from 'src/shared/interceptor/logging.interceptor';
import { TransformInterceptor } from 'src/shared/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Loại bỏ các trường không có trong DTO
    forbidNonWhitelisted: true, // Bắt lỗi nếu có trường không có trong DTO ,
    transform: true, // Tự động chuyển đổi kiểu dữ liệu
    exceptionFactory: (errors) => {
      console.log(errors);
      return new UnprocessableEntityException(errors.map((error) => ({
        field: error.property,
        errors: Object.values(error.constraints as any).join(', ')
      })))
    }
  }));

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
