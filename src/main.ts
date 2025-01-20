import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Enable CORS
    app.enableCors({
      origin: '*', // Izinkan semua domain (tidak disarankan untuk produksi)
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
    });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
