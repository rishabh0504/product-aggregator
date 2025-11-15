import { Controller, Get } from '@nestjs/common';
import { ProviderBService } from './provider-b.service';

@Controller('mock-providers/provider-b')
export class ProviderBController {
  constructor(private readonly svc: ProviderBService) {}

  @Get('products')
  getProducts() {
    // returns { products: [...] }
    return this.svc.getProducts();
  }
}
