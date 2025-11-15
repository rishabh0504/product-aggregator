import { Controller, Get } from '@nestjs/common';
import { ProviderCService } from './provider-c.service';

@Controller('mock-providers/provider-c')
export class ProviderCController {
  constructor(private readonly svc: ProviderCService) {}

  @Get('products')
  getProducts() {
    return this.svc.getProducts();
  }
}
