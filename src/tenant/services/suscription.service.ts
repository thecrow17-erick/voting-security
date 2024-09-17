import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from "stripe"
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { CreateTenantDto } from '../dto';
import { TenantService } from './tenant.service';
import { UserService } from 'src/user/service';
import { Tenant } from '../entity';
import { Plan } from 'src/constant';

@Injectable()
export class SuscriptionService {
  private readonly stripe:Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
    private readonly userService: UserService,
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>
  ){
    this.stripe = new Stripe(this.configService.get<string>("stripe_key_api"))
  }

  public async createSuscription(createTenantDto: CreateTenantDto, userId: string):Promise<Stripe.Response<Stripe.Checkout.Session>>{
    try {
      if(createTenantDto.plan === "Gold" && (!createTenantDto.number_voting ||  createTenantDto.number_voting <= 500))
        throw new BadRequestException("El plan gold necesita un numero de votantes arriba de 500 personas")

      const findTenants = await this.tenantService.findOrTenant([
        {
          domain: createTenantDto.domain
        },
        {
          name: createTenantDto.name
        }
      ]);
      if(findTenants.length)
        throw new BadRequestException("Ingrese otro nombre o subdominio, ya se encuentra en uso");

      const metadata = {
        userId: String(userId), 
        plan: createTenantDto.plan,
        domain: createTenantDto.domain,
        name: createTenantDto.name,
        number_voting: createTenantDto.number_voting?.toString()?? "500"
      }
      const paymentStripe = await this.payment([
        {
          price_data: {
            product_data:{
              name: createTenantDto.plan,
              description: `Plan ${createTenantDto.plan} de suscripcion del servicio de votacion con blockchain.` 
            },
            currency: 'usd',
            unit_amount: (createTenantDto.plan === "Gold" ? 100 * 100: 0)
          },
          quantity: 1
        }
      ], metadata)

      return paymentStripe;
    } catch (err) {
      if(err instanceof BadRequestException)
        throw err;
      console.log(err)
      throw new InternalServerErrorException(`Server error ${err}`);
    }
  }


  private async payment (line_items: Stripe.Checkout.SessionCreateParams.LineItem[], metadata: Stripe.Metadata) {
    const pago = await this.stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url:  this.configService.get<string>("stripe_sucess_url"),
        cancel_url:   this.configService.get<string>("stripe_cancel_url"),
        metadata,
    })
    return pago
  }

  public async webhookPayment(body: Stripe.Metadata): Promise<Tenant>{
    const session = await this.tenantModel.db.startSession();
    session.startTransaction();
    try {
      const data = {
        userId: body.userId, 
        plan: body.plan as Plan,
        domain: body.domain,
        name: body.name,
        number_voting: +body.number_voting
      };
      console.log(data);
      const findTenant = await this.tenantService.findOrTenant([
        {
          name: data.name
        },
        {
          domain: data.domain
        }
      ]);
      if(findTenant.length)
        throw new BadRequestException("Tenant ya en uso");

      const createTenant = await this.tenantService.createTenant({
        limit_voting: data.number_voting,
        name: data.name,
        plan: data.plan,
        subdomain: data.domain
      });

      await this.tenantService.createMemberTenant({
        tenantId: String(createTenant._id),
        userId: data.userId,
      }, "owner");
      await session.commitTransaction();
      session.endSession();
      return createTenant;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      if(err instanceof BadRequestException)
        throw err

      throw new InternalServerErrorException(`server error ${err}`)
    }
  }
}
