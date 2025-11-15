import { Controller, Get, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { ChangesQueryDto } from './dto/changes-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  async list(@Query() query: QueryProductsDto) {
    return this.svc.listProducts(query);
  }

  @Get('changes')
  async changes(@Query() query: ChangesQueryDto) {
    const minutes = query.minutes ?? 60;
    return this.svc.getProductsChanges(minutes);
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return this.svc.getProductById(id);
  }
}
