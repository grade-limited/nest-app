import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { AccesspointModule } from './accesspoint/accesspoint.module';
import { AdminModule } from './admin/admin.module';
import { SessionsModule as EmployeeSessionsModule } from './employees-sessions/sessions.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DatabaseModule,
    AdminModule,
    EmployeesModule,
    EmployeeSessionsModule,
    AccesspointModule,
    RolesModule,
    PermissionsModule,
    BrandsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
