import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyOtpDto } from 'src/dto';
import { Otp, Refresh, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Otp) private readonly otpModel: Repository<Otp>,
    @InjectRepository(Refresh)
    private readonly refreshModel: Repository<Refresh>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ where: { email } });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return await this.userModel.findOneBy({ id });
  }

  async createUser(newUser: Partial<User>): Promise<User> {
    const user = this.userModel.create(newUser);
    return await this.userModel.save(user);
  }

  async createOtp(newOtp: VerifyOtpDto): Promise<Otp> {
    const newOtpUser = this.otpModel.create({
      user: { id: newOtp.user_id },
      otp: newOtp.otp,
    });
    return await this.otpModel.save(newOtpUser);
  }

  async updateUserStatus(id: string): Promise<undefined> {
    await this.userModel.update(id, { status: 'active' });
  }

  async deleteOtp(id: string): Promise<undefined> {
    await this.otpModel.delete(id);
  }

  async findOneOtp(id: string): Promise<Otp | undefined> {
    return await this.otpModel.findOne({ where: { user: { id } } });
  }

  async createAndUpdateToken(token: {
    user_id: string;
    refresh: string;
  }): Promise<Refresh> {
    const existingRefresh = await this.findOneToken(token.user_id);

    if (existingRefresh) {
      await this.refreshModel.update(existingRefresh.id, {
        refresh: token.refresh,
      });
      return await this.findOneToken(token.user_id);
    } else {
      const newRefresh = this.refreshModel.create({
        user: { id: token.user_id },
        refresh: token.refresh,
      });
      return await this.refreshModel.save(newRefresh);
    }
  }

  async findOneToken(id: string) {
    return await this.refreshModel.findOne({ where: { user: { id } } })
  }

  async deleteToken(id: string) {
    await this.refreshModel.delete(id)
  }
}
