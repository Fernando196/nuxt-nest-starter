import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const CreateUserSchema = z.object({
  email: z.string().email('Email inválido').max(200),
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  active: z.boolean().default(true),
})

export const UpdateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  active: z.boolean().optional(),
})

export const UserQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  active: z.coerce.boolean().optional(),
})

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
export class UserQueryDto extends createZodDto(UserQuerySchema) {}

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type UserQuery = z.infer<typeof UserQuerySchema>
