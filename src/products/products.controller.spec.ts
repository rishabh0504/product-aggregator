import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    listProducts: jest.fn(),
    getProductsChanges: jest.fn(),
    getProductById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call listProducts on list()', async () => {
    const query = { limit: 10 } as any;
    await controller.list(query);
    expect(mockProductsService.listProducts).toHaveBeenCalledWith(query);
  });

  it('should call getProductsChanges on changes()', async () => {
    const query = { minutes: 30 } as any;
    await controller.changes(query);
    expect(mockProductsService.getProductsChanges).toHaveBeenCalledWith(30);
  });

  it('should call getProductById on get()', async () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    await controller.get(id);
    expect(mockProductsService.getProductById).toHaveBeenCalledWith(id);
  });
});
