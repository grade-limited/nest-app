import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeshipsController } from './employeeships.controller';
import { EmployeeshipsService } from './employeeships.service';

describe('EmployeeshipsController', () => {
  let controller: EmployeeshipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeshipsController],
      providers: [EmployeeshipsService],
    }).compile();

    controller = module.get<EmployeeshipsController>(EmployeeshipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
