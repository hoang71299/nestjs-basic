import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

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


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
