import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { schema } from './utils/env.validations';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      validationSchema: schema,
    }),
    MongooseModule.forRoot(process.env.DB_URL, {
      dbName: process.env.DB_NAME,
    }),

    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
