import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { ExampleRepository, type PaginatedResult } from './repositories/example.repository'
import { Example } from './entities/example.entity'
import type { CreateExampleInput, UpdateExampleInput, ExampleQuery } from './dto/example.dto'

export type { PaginatedResult } from './repositories/example.repository'

@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  async findAll(query: ExampleQuery): Promise<PaginatedResult<Example>> {
    return this.exampleRepository.findAll(query)
  }

  async findOne(id: string): Promise<Example> {
    const example = await this.exampleRepository.findById(id)
    if (!example) {
      throw new NotFoundException(`Registro con ID "${id}" no encontrado`)
    }
    return example
  }

  async create(input: CreateExampleInput): Promise<Example> {
    const exists = await this.exampleRepository.exists({ title: input.title })
    if (exists) {
      throw new ConflictException(`Ya existe un registro con el título "${input.title}"`)
    }
    return this.exampleRepository.create({
      title: input.title,
      description: input.description ?? null,
      active: input.active,
    })
  }

  async update(id: string, input: UpdateExampleInput): Promise<Example> {
    const example = await this.findOne(id)
    if (input.title && input.title !== example.title) {
      const exists = await this.exampleRepository.exists({ title: input.title })
      if (exists) {
        throw new ConflictException(`Ya existe un registro con el título "${input.title}"`)
      }
    }
    const patch: Partial<Example> = {}
    if (input.title !== undefined) patch.title = input.title
    if (input.description !== undefined) patch.description = input.description ?? null
    if (input.active !== undefined) patch.active = input.active
    return this.exampleRepository.update(example, patch)
  }

  async remove(id: string): Promise<void> {
    const example = await this.findOne(id)
    await this.exampleRepository.softDelete(example)
  }
}
