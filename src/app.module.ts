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
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SessionsModule as UserSessionsModule } from './users-sessions/sessions.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { FilesModule } from './files/files.module';
import { RequestsModule } from './requests/requests.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { EmployeeshipsModule } from './employeeships/employeeships.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    UserSessionsModule,
    AdminModule,
    EmployeesModule,
    EmployeeSessionsModule,
    AccesspointModule,
    RolesModule,
    PermissionsModule,
    BrandsModule,
    ProductsModule,
    CategoriesModule,
    OrganizationsModule,
    FilesModule,
    RequestsModule,
    CampaignsModule,
    EmployeeshipsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
