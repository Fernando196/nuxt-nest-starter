import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import { User } from '../modules/users/entities/user.entity'

dotenv.config()

export default new DataSource({
  type: 'mysql',
  host: process.env['DATABASE_HOST'] ?? 'localhost',
  port: Number(process.env['DATABASE_PORT'] ?? 3306),
  username: process.env['DATABASE_USER'] ?? 'root',
  password: process.env['DATABASE_PASSWORD'] ?? 'root',
  database: process.env['DATABASE_NAME'] ?? 'app_db',
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
})
