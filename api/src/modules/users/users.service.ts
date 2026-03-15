import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@tenantmq.local';
    const adminExists = await this.usersRepository.findOneBy({ email: adminEmail });

    if (!adminExists) {
      this.logger.log('Seed: Criando usuário Super Admin padrão...');
      const defaultPassword = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      const superAdmin = this.usersRepository.create({
        email: adminEmail,
        passwordHash,
        role: UserRole.SUPER_ADMIN,
      });

      await this.usersRepository.save(superAdmin);
      this.logger.log(`Super Admin criado com sucesso! Email: ${adminEmail}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }
}