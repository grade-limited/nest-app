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
import { SearchModule } from './search/search.module';
import { EmployeeshipsModule } from './employeeships/employeeships.module';
import { ShopModule } from './shop/shop.module';
import { CartsModule } from './carts/carts.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { QuotationsModule } from './quotations/quotations.module';
import { OrdersModule } from './orders/orders.module';
import { CartQuotationModule } from './cart-quotation/cart-quotation.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrgOrdersModule } from './org_orders/org_orders.module';
import { OrgCartsModule } from './org_carts/org_carts.module';
import { SmsModule } from './sms/sms.module';

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
    SearchModule,
    EmployeeshipsModule,
    ShopModule,
    CartsModule,
    BookmarksModule,
    NewslettersModule,
    QuotationsModule,
    OrdersModule,
    CartQuotationModule,
    AddressesModule,
    OrgOrdersModule,
    OrgCartsModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
