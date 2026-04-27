# CLAUDE.md — {{PROJECT_NAME}}

> Archivo de instrucciones para Claude Code. Lee esto antes de tocar cualquier archivo.

## 🧠 Contexto del proyecto

Este es **{{PROJECT_NAME}}**, una REST API construida con:
- **NestJS** — framework Node.js con arquitectura modular
- **TypeScript strict** — sin `any`, decoradores tipados
- **TypeORM** — ORM para PostgreSQL
- **Zod** — validación de schemas (en lugar de class-validator)
- **Swagger/OpenAPI** — documentación automática
- **JWT** — autenticación stateless
- **Winston** — logging estructurado

## 📁 Estructura de carpetas

```
src/
├── modules/
│   └── [feature]/          # Un módulo por dominio (users, auth, products...)
│       ├── dto/             # Data Transfer Objects con tipos estrictos
│       ├── entities/        # Entidades TypeORM
│       ├── [feature].controller.ts
│       ├── [feature].service.ts
│       ├── [feature].module.ts
│       └── [feature].repository.ts  # Opcional, para queries complejas
├── common/
│   ├── decorators/          # @CurrentUser, @Roles, @ApiAuth...
│   ├── filters/             # GlobalExceptionFilter
│   ├── guards/              # JwtAuthGuard, RolesGuard
│   ├── interceptors/        # LoggingInterceptor, TransformInterceptor
│   └── pipes/               # ZodValidationPipe
├── config/                  # Configuración tipada con @nestjs/config
└── main.ts                  # Bootstrap con Swagger, validación, CORS
```

## ⚙️ Reglas de TypeScript

- **NUNCA uses `any`**. Usa `unknown` + narrowing o el tipo correcto.
- Todos los DTOs son interfaces o clases con propiedades tipadas.
- Los servicios devuelven tipos explícitos: `Promise<User>`, no `Promise<any>`.
- Usa `readonly` en propiedades que no cambian.
- Los repositorios retornan `Entity | null`, no `Entity | undefined`.

## 🏗️ Reglas de arquitectura NestJS

### Módulos
Cada feature = un módulo. El módulo registra sus providers y exporta solo lo que otros módulos necesitan.

```typescript
// ✅ Correcto: módulo enfocado
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],  // solo si otros módulos lo necesitan
})
export class UsersModule {}
```

### Controladores
- Solo reciben la request y llaman al servicio — sin lógica de negocio
- Usan decoradores de Swagger en TODOS los endpoints
- Siempre especifican el código HTTP de respuesta

```typescript
// ✅ Correcto
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOneOrFail(id)
  }
}
```

### Servicios
- Contienen la lógica de negocio
- Lanzan excepciones de NestJS (`NotFoundException`, `ConflictException`, etc.)
- No saben nada de HTTP

```typescript
// ✅ Correcto
async findOneOrFail(id: string): Promise<User> {
  const user = await this.usersRepository.findOne({ where: { id } })
  if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`)
  return user
}

// ❌ Incorrecto: lógica en el controlador
@Get(':id')
async findOne(@Param('id') id: string) {
  const user = await this.db.find(id)
  if (!user) return { error: 'not found' }  // ← nunca
  return user
}
```

### DTOs y validación con Zod

Usa Zod schemas para validar en el `ZodValidationPipe` global:

```typescript
// dto/create-user.dto.ts
import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const CreateUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  name: z.string().min(2).max(100),
})

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export type CreateUserInput = z.infer<typeof CreateUserSchema>
```

### Entidades TypeORM

```typescript
// entities/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string  // usa ! para campos gestionados por la DB

  @Column({ unique: true })
  email!: string

  @Column()
  name!: string

  @Column({ select: false })  // no exponer en queries por defecto
  passwordHash!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
```

## 🔒 Seguridad

- Siempre hashea contraseñas con bcrypt (cost factor 12)
- Los endpoints privados usan `@UseGuards(JwtAuthGuard)` — aplícalo a nivel de controlador, no de método
- Sanitiza todos los inputs — Zod lo hace automáticamente
- Nunca retornes el campo `passwordHash` en las respuestas
- Configura rate limiting en endpoints de auth

## 🚫 Cosas que NUNCA debes hacer

- No uses `class-validator` — usa Zod
- No hagas queries directas en el controlador — usa servicios
- No uses `find()` sin condiciones — puede retornar miles de registros
- No ignores los errores de TypeORM — mánejalos en el filtro global
- No expongas errores de DB al cliente

## ✅ Comandos útiles

```bash
pnpm start:dev    # Servidor con hot-reload
pnpm build        # Build de producción
pnpm start:prod   # Servidor de producción
pnpm typecheck    # Verifica tipos
pnpm test         # Jest unit tests
pnpm test:e2e     # Tests end-to-end
pnpm migration:generate -- --name=NombreMigracion  # Nueva migración
pnpm migration:run                                  # Correr migraciones
```

## 📍 URLs importantes

- API: `http://localhost:3001`
- Swagger UI: `http://localhost:3001/api/docs`
- Health check: `http://localhost:3001/health`
