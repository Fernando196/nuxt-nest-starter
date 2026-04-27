import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository, FindOptionsWhere } from 'typeorm'
import { User } from '../entities/user.entity'
import type { UserQuery } from '../dto/user.dto'
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(query: UserQuery): Promise<PaginatedResult<User>> {
    const { page, limit, search, active } = query
    const skip = (page - 1) * limit

    const qb = this.repo
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')

    if (search) {
      qb.andWhere(
        'user.name LIKE :search OR user.email LIKE :search',
        { search: `%${search}%` },
      )
    }

    if (active !== undefined) {
      qb.andWhere('user.active = :active', { active })
    }

    const [items, total] = await qb
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } as FindOptionsWhere<User> })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } as FindOptionsWhere<User> })
  }

  async create(data: Partial<User>): Promise<User> {
    const entity = this.repo.create(data)
    return this.repo.save(entity)
  }

  async update(entity: User, data: Partial<User>): Promise<User> {
    const merged = this.repo.merge(entity, data)
    return this.repo.save(merged)
  }

  async softDelete(entity: User): Promise<void> {
    await this.repo.softRemove(entity)
  }

  async exists(where: FindOptionsWhere<User>): Promise<boolean> {
    const count = await this.repo.countBy(where)
    return count > 0
  }
}
