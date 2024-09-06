import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfig, envSchema } from './config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(),'src/schema.gql'),
      playground: false,
    }),
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
    UserModule
  ],
  
  providers: [],  
})
export class AppModule {}
