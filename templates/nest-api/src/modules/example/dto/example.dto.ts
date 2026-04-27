import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const CreateExampleSchema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres').max(200),
  description: z.string().max(1000).optional(),
  active: z.boolean().default(true),
})

export const UpdateExampleSchema = CreateExampleSchema.partial()

export const ExampleQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  active: z.coerce.boolean().optional(),
})

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export class CreateExampleDto extends createZodDto(CreateExampleSchema) {}
export class UpdateExampleDto extends createZodDto(UpdateExampleSchema) {}
export class ExampleQueryDto extends createZodDto(ExampleQuerySchema) {}

// ─── Tipos inferidos ──────────────────────────────────────────────────────────

export type CreateExampleInput = z.infer<typeof CreateExampleSchema>
export type UpdateExampleInput = z.infer<typeof UpdateExampleSchema>
export type ExampleQuery = z.infer<typeof ExampleQuerySchema>
