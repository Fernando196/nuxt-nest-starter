import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerModule } from '@nestjs/throttler'
import { UsersModule } from './modules/users/users.module'
import { User } from './modules/users/entities/user.entity'

@Module({
  imports: [
    // Config global
    ConfigModule.forRoot({ isGlobal: true }),

    // Base de datos — TypeORM con MySQL
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host:     config.get<string>('DATABASE_HOST', 'localhost'),
        port:     config.get<number>('DATABASE_PORT', 3306),
        username: config.get<string>('DATABASE_USER', 'root'),
        password: config.get<string>('DATABASE_PASSWORD', 'root'),
        database: config.get<string>('DATABASE_NAME', 'app_db'),
        entities: [User],
        synchronize: config.get<string>('NODE_ENV') !== 'production',  // solo en dev
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    // Rate limiting global
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // Módulos de la app
    UsersModule,
  ],
})
export class AppModule {}
