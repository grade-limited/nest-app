import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { ConfigModule } from '@nestjs/config';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { AccesspointModule } from './accesspoint/accesspoint.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { SessionsModule as EmployeeSessionsModule } from './employees-sessions/sessions.module';
import { UsersModule } from './users/users.module';
import { SessionsModule as UserSessionsModule } from './users-sessions/sessions.module';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver } from '@nestjs/apollo';
// import { join } from 'path';
import { SubjectsModule } from './subjects/subjects.module';
import { ChaptersModule } from './chapters/chapters.module';
import { TopicsModule } from './topics/topics.module';
import { QuestionBankModule } from './question-bank/question-bank.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { CategoryModule } from './category/category.module';
import { ReportsModule } from './reports/reports.module';
import { CouponsModule } from './coupons/coupons.module';
import { PackagesModule } from './packages/packages.module';
import { WalletsModule } from './wallets/wallets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // GraphQLModule.forRoot({
    //   driver: ApolloDriver,
    //   playground: true,
    //   autoSchemaFile: join(process.cwd(), 'src/graph.schema.gql'), // Automatically Generate GraphQL File
    //   definitions: {
    //     path: join(process.cwd(), 'src/graph.interface.ts'),
    //     // additionalHeader: '/* eslint-disable prettier/prettier */',
    //   },
    //   // typePaths: ['./**/*.graphql'], // Manually Read GraphQL File
    // }),
    DatabaseModule,
    AuthModule,
    AdminModule,
    UsersModule,
    UserSessionsModule,
    EmployeesModule,
    EmployeeSessionsModule,
    AccesspointModule,
    RolesModule,
    PermissionsModule,
    SubjectsModule,
    ChaptersModule,
    TopicsModule,
    QuestionBankModule,
    ExamsModule,
    QuestionsModule,
    AnswersModule,
    CategoryModule,
    ReportsModule,
    CouponsModule,
    PackagesModule,
    WalletsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
