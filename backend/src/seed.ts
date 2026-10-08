import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  console.log('--- Starting Products Database Seed ---');
  const result = await productsService.seed();
  console.log(result.message);
  console.log('--- Seeding Completed Successfully ---');

  await app.close();
}

runSeed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
