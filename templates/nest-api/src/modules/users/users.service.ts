import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { UserRepository } from './repositories/user.repository'
import { User } from './entities/user.entity'
import type { CreateUserInput, UpdateUserInput, UserQuery } from './dto/user.dto'
import type { PaginatedResult } from './repositories/user.repository'

export type { PaginatedResult } from './repositories/user.repository'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(query: UserQuery): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(query)
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) throw new NotFoundException(`Usuario con ID "${id}" no encontrado`)
    return user
  }

  async create(input: CreateUserInput): Promise<User> {
    const exists = await this.userRepository.exists({ email: input.email })
    if (exists) throw new ConflictException(`Ya existe un usuario con el email "${input.email}"`)
    const passwordHash = await bcrypt.hash(input.password, 12)
    return this.userRepository.create({
      email: input.email,
      name: input.name,
      passwordHash,
      active: input.active,
    })
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id)
    const patch: Partial<User> = {}
    if (input.name !== undefined) patch.name = input.name
    if (input.active !== undefined) patch.active = input.active
    return this.userRepository.update(user, patch)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await this.userRepository.softDelete(user)
  }
}
