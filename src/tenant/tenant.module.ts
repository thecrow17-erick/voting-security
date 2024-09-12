import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { MemberTenant, memberTenantSchema, Tenant, tenantSchema } from './entity';
import { User, userSchema } from 'src/user/entity';
import { SuscriptionService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: tenantSchema
      },
      {
        name: User.name,
        schema: userSchema
      },
      {
        name: MemberTenant.name,
        schema: memberTenantSchema
      }
    ])
  ],
  providers: [SuscriptionService]
})
export class TenantModule {}
