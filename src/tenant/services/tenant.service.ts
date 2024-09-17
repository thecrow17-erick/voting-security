import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Configuration, MemberTenant, Tenant } from '../entity';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { ICreateMember, ICreateTenant } from '../interface';
import { Plan } from 'src/constant';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    @InjectModel(Configuration.name) private configurationModel: Model<Configuration>,
    @InjectModel(MemberTenant.name) private memberModel: Model<MemberTenant>
  ){}


  public async createTenant(body: ICreateTenant,session:ClientSession): Promise<Tenant>{
    const findTenant = await this.findOrTenant([
        {
          name: body.name
        },
        {
          domain: body.subdomain
        }
    ])

    if(findTenant.length)
      throw new BadRequestException("Ya existe un tenant con estas caracteristicas")
    
    const tenantCreate = await this.tenantModel.create({
      name: body.name,
      domain: body.subdomain,
      logo_url: body.logoUrl?? undefined,
      configuration: await this.configurationModel.create({
        plan: (body.plan === Plan.Basic) ? Plan.Basic : Plan.Gold,
        limit_voting: body.limit_voting,
        document_recognition: (body.plan === Plan.Basic) ? false: true,
        firewall:  (body.plan === Plan.Basic) ? false: true,
      },{
        session
      })
    })
    return tenantCreate;
  }


  public async findOrTenant(OR:FilterQuery<Tenant>[]): Promise<Tenant[]>{
    const findTenant = await this.tenantModel.find({
      $or: OR
    })
    return findTenant;
  }

  public async createMemberTenant(createMember: ICreateMember, role: string="member",session: ClientSession): Promise<MemberTenant[]>{
    const findMember = await this.findAndMember(createMember);

    if(findMember)
      throw new BadRequestException("El usuario ya esta en el area de trabajo")

    const createMembers = await this.memberModel.create({
      user: createMember.userId,
      tenant: createMember.tenantId,
      role,
    },{
      session
    });

    return createMembers;
  }

  public async findAndMember(createMember: ICreateMember): Promise<MemberTenant>{
    const findMember = await this.memberModel.findOne({
      $and: [
        {
          user: createMember.userId
        },
        {
          tenant: createMember.tenantId
        }
      ]
    })

    return findMember;
  }

}
