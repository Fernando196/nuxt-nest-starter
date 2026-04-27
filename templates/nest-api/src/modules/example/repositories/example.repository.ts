import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository, FindOptionsWhere } from 'typeorm'
import { Example } from '../entities/example.entity'
import type { ExampleQuery } from '../dto/example.dto'

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

@Injectable()
export class ExampleRepository {
  constructor(
    @InjectRepository(Example)
    private readonly repo: Repository<Example>,
  ) {}

  async findAll(query: ExampleQuery): Promise<PaginatedResult<Example>> {
    const { page, limit, search, active } = query
    const skip = (page - 1) * limit

    const qb = this.repo
      .createQueryBuilder('example')
      .where('example.deletedAt IS NULL')

    if (search) {
      qb.andWhere(
        'example.title ILIKE :search OR example.description ILIKE :search',
        { search: `%${search}%` },
      )
    }

    if (active !== undefined) {
      qb.andWhere('example.active = :active', { active })
    }

    const [items, total] = await qb
      .orderBy('example.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount()

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findById(id: string): Promise<Example | null> {
    return this.repo.findOne({
      where: { id } as FindOptionsWhere<Example>,
    })
  }

  async findByTitle(title: string): Promise<Example | null> {
    return this.repo.findOne({
      where: { title } as FindOptionsWhere<Example>,
    })
  }

  async create(data: Partial<Example>): Promise<Example> {
    const entity = this.repo.create(data)
    return this.repo.save(entity)
  }

  async update(entity: Example, data: Partial<Example>): Promise<Example> {
    const merged = this.repo.merge(entity, data)
    return this.repo.save(merged)
  }

  async softDelete(entity: Example): Promise<void> {
    await this.repo.softRemove(entity)
  }

  async exists(where: FindOptionsWhere<Example>): Promise<boolean> {
    const count = await this.repo.countBy(where)
    return count > 0
  }
}
