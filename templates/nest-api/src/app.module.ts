import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
import { ExampleModule } from './modules/example/example.module'
import { Example } from './modules/example/entities/example.entity'

@Module({
  imports: [
    // Config global
    ConfigModule.forRoot({ isGlobal: true }),

    // Base de datos — TypeORM con PostgreSQL
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host:     config.get<string>('DATABASE_HOST', 'localhost'),
        port:     config.get<number>('DATABASE_PORT', 5432),
        username: config.get<string>('DATABASE_USER', 'postgres'),
        password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
        database: config.get<string>('DATABASE_NAME', 'app_db'),
        entities: [Example],
        synchronize: config.get<string>('NODE_ENV') !== 'production',  // solo en dev
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // Rate limiting global
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // Módulos de la app
    ExampleModule,
  ],
})
export class AppModule {}
