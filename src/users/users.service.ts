import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class UsersService {
  // Hardcoded user data - Replace this with database logic
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createOne(user:User) {
    return this.usersRepository.save(user);
  }

  async findOne(email: string): Promise<User | undefined> {
    let Email = email;
    return await this.usersRepository.findOne({ where: { Email } });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async earn(email: string, points:number): Promise<User | undefined> {
    let Email = email;
    let user = this.usersRepository.findOne({ where: { Email } });
    console.log(email);
    (await user).Points += points;
    this.usersRepository.update((await user).id,(await user));
    return (await user);
  }

  async burn(email: string, points:number): Promise<User | undefined> {
    let Email = email;
    let user = this.usersRepository.findOne({ where: { Email } });
    if((await user).Points >= points) (await user).Points -= points;
    else (await user).Points = 0;
    this.usersRepository.update((await user).id,(await user));
    return (await user);
  }
}
