import { Controller, Get } from '@nestjs/common';
import { ProviderAService } from './provider-a.service';

@Controller('mock-providers/provider-a')
export class ProviderAController {
  constructor(private readonly svc: ProviderAService) {}

  @Get('products')
  getProducts() {
    // returns array of flat product objects
    return this.svc.getProducts();
  }
}
