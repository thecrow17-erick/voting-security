import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor (
    @InjectModel(User.name) private userModel: Model<User> 
  ){}


  async createUser(){
    const user = await this.userModel.create({
      email: "erick@gmail.com",
      password: "123",
      username: "Erick"
    })
    return user;
  }

}
