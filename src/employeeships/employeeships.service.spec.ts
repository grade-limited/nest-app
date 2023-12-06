import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeshipsService } from './employeeships.service';

describe('EmployeeshipsService', () => {
  let service: EmployeeshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeshipsService],
    }).compile();

    service = module.get<EmployeeshipsService>(EmployeeshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
