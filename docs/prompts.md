# 🤖 Prompts para vibe coding

Colección de prompts listos para usar con Claude Code en los templates de este repo.

> **Cómo usarlos:** Copia el prompt, ábrelo en Claude Code (`claude`) dentro de tu proyecto generado, y pégalo. El `CLAUDE.md` ya le da a Claude el contexto necesario.

---

## Nuxt 3 (`nuxt-app`)

### Auth y usuarios

```
Implementa el flujo completo de autenticación:
- Página /login con formulario (email + password) usando VeeValidate + Zod
- Página /register con confirmación de contraseña
- Middleware auth.ts que redirija a /login si no hay sesión
- Usa el authStore existente en stores/auth.store.ts
- Muestra errores del servidor en el formulario usando UIInput con prop error
- TypeScript strict en todo, sin ningún any
```

```
Crea un sistema de permisos basado en roles:
- Composable usePermissions() que lea el user del authStore existente
- Helpers tipados: canCreate, canEdit, canDelete según UserRole
- Directiva v-permission="'admin'" que oculta elementos si no tiene el rol
- Middleware para rutas que requieren rol específico
- Usa los tipos UserRole del types/index.ts existente
```

### Páginas CRUD

```
Crea una página CRUD completa para Productos siguiendo el patrón de pages/users.vue:
- UIPageHeader con título "Productos" y botón "Nuevo producto"
- UIDataTable con columnas TanStack (ColumnDef<Product>[]): nombre, precio, stock, activo
- Modal de creación/edición usando openModal() de useModal() — crea ProductFormModal.vue en components/modals/
- Búsqueda debounced con useDebounceFn de VueUse (300ms)
- Paginación manejada con @page-change
- Columna de precio formateada con Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
- Columna de activo con badge de color usando --color-success / --color-error
- Soft delete con confirmación
- TypeScript strict, sin ningún any
```

```
Crea un módulo de Categorías con selector en el formulario de Productos:
- Página /categories con UIDataTable y CRUD completo (mismo patrón que pages/users.vue)
- CategoryFormModal.vue en components/modals/
- En ProductFormModal.vue agrega un <select> que cargue las categorías desde GET /categories
- Tipado: Category { id, name, slug }
```

### Componentes UI

```
Crea un sistema de notificaciones toast:
- Composable useToast() con métodos: success(msg), error(msg), warning(msg), info(msg)
- Cada toast tiene: id, type, message, duration (default 4000ms)
- Componente UIToastContainer en components/ui/ renderizado en esquina inferior derecha
- Animación de entrada/salida con Transition de Vue
- Auto-dismiss con setTimeout, cancelable al hacer hover
- Registrado en app.vue junto al ModalHost existente
- Usa las variables CSS del tema: --color-success-bg, --color-error-bg, --color-warning-bg, --color-info-bg
```

```
Crea un componente UISelect reutilizable:
- Props tipadas: modelValue, options ({ label: string, value: string | number }[]), label?, placeholder?, error?, disabled?
- Compatible con v-model
- Mismo estilo visual que UIInput: border --color-border, focus --color-primary, error --color-error
- Va en components/ui/UISelect.vue
```

```
Crea un componente UIBadge:
- Props: variant ('success' | 'error' | 'warning' | 'info' | 'neutral'), size ('sm' | 'md')
- Usa las variables CSS del tema para colores de fondo y texto
- Prop dot?: boolean para mostrar punto indicador
- Va en components/ui/UIBadge.vue
```

### Datos y API

```
Crea un composable genérico useCrud<T>() que encapsule el patrón de las páginas:
- State: items, total, totalPages, isLoading, page, search
- Métodos: fetch(), create(data), update(id, data), remove(id)
- Acepta endpoint base como parámetro: useCrud<Product>('/products')
- Búsqueda debounced con useDebounceFn de VueUse (300ms)
- Usa el useApi composable existente
- TypeScript strict con generics, sin ningún any
```

```
Implementa infinite scroll en una página /feed:
- Composable useInfiniteScroll<T>(fetchFn) genérico
- Usa IntersectionObserver para detectar el final de la lista
- Acumula resultados en un array tipado
- Skeleton de carga mientras trae más registros
- Mensaje "No hay más resultados" cuando se alcanza el total
```

---

## NestJS (`nest-api`)

### Módulos CRUD

```
Crea un módulo Products completo siguiendo EXACTAMENTE la arquitectura del módulo example/:
- Entidad Product (TypeORM): id (uuid), name, description?, price (decimal 10,2), stock (int), active (bool default true), createdAt, updatedAt, deletedAt
- ProductRepository con patrón Repository igual que example.repository.ts: findAll paginado con QueryBuilder, findById, create, update, softDelete, exists
- DTOs con Zod: CreateProductSchema, UpdateProductSchema, ProductQuerySchema (filtros: active, search)
- ProductsService que use ProductRepository con validación de duplicados en create/update
- ProductsController REST con Swagger en todos los endpoints, ParseUUIDPipe en params
- ProductsModule registrado en AppModule
```

```
Agrega un módulo Categories con relación ManyToOne a Products:
- Entidad Category: id (uuid), name, slug (único), description?, createdAt, updatedAt
- CRUD completo con el mismo patrón Repository
- Product tiene categoryId (FK nullable) y relación @ManyToOne(() => Category)
- En ProductRepository cargar la relación: .leftJoinAndSelect('product.category', 'category')
- Filtro GET /products?categoryId=xxx en ProductQuerySchema
```

### Auth y seguridad

```
Implementa autenticación JWT completa:
- AuthModule con endpoints: POST /auth/register, POST /auth/login, GET /auth/me, POST /auth/logout
- UserEntity: id (uuid), email (único), name, passwordHash (select: false), role (enum: admin | user), createdAt, updatedAt
- UserRepository con el patrón Repository existente
- Hash con bcryptjs cost factor 12
- JWT access token (15min) + refresh token (7 días) en httpOnly cookie
- JwtStrategy con Passport que carga el usuario completo desde la DB
- @CurrentUser() decorator tipado que retorna User
- JwtAuthGuard aplicado a nivel de controlador
- Sigue la arquitectura de modules/example/ para los módulos de Auth y Users
```

```
Agrega rate limiting diferenciado:
- ThrottlerModule ya está en AppModule — agrégale un throttler named 'strict'
- Aplica @Throttle({ strict: { ttl: 60000, limit: 5 } }) en POST /auth/login y POST /auth/register
- Respuesta 429 con mensaje claro en español
- El límite global de 100/min sigue activo para el resto
```

### Arquitectura y calidad

```
Agrega health check:
- Instala @nestjs/terminus
- Endpoint GET /health sin autenticación, excluido del TransformInterceptor
- Checks: TypeORM (base de datos), memoria heap (máx 500MB), disco (máx 90%)
- Respuesta con status de cada check individual
```

```
Crea un sistema de auditoría:
- AuditLog entity: id, userId (nullable), action (CREATE|UPDATE|DELETE), entity, entityId, changedFields (json), ip, userAgent, createdAt
- AuditInterceptor que capture automáticamente POST, PATCH, PUT, DELETE
- AuditRepository con el patrón existente
- Endpoint GET /audit-logs solo para admins, filtros: userId, entity, action, dateFrom, dateTo
- No auditar GET requests ni /health
```

```
Implementa upload de archivos:
- Endpoint POST /uploads con @nestjs/multer
- Validación: solo imágenes (jpg, png, webp), máximo 5MB
- Guarda en disco local en /uploads/ (configurable por env)
- FileEntity: id, originalName, filename, mimetype, size, path, createdAt
- FileRepository con el patrón existente
- Responde con la URL pública del archivo
- DELETE /uploads/:id con soft delete
```

---

## Tips para mejores resultados con Claude Code

1. **Referencia archivos existentes**: "Sigue el patrón de `modules/example/`" le da a Claude un ejemplo concreto en lugar de inventar uno nuevo.

2. **Un módulo a la vez**: Pide una cosa completa en lugar de muchas cosas a medias.

3. **Menciona las restricciones clave**: "Sin ningún `any`", "soft delete", "paginación siempre", "patrón Repository".

4. **Usa los nombres exactos**: Menciona `useModal`, `UIDataTable`, `UIPageHeader`, `useApi` — Claude sabe cómo funcionan porque están en el `CLAUDE.md`.

5. **Itera en pequeños pasos**: Genera el módulo → revisa → pide ajustes específicos. Es más rápido que pedir todo de una.
