import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfig, envSchema } from './config/env';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[envConfig],
      isGlobal: true,
      validationSchema: envSchema
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory:(config: ConfigService )=> ({
        uri: config.get<string>('database_url')  
      }),
      inject:[ConfigService]
    }),
    NestjsFormDataModule.configAsync({
      useFactory: ()=>({
        storage: FileSystemStoredFile,
        fileSystemStoragePath: '/tmp',
      }),
      isGlobal: true,
    }),
    UserModule,
    AuthModule
  ],
  
  providers: [],  
})
export class AppModule {}
