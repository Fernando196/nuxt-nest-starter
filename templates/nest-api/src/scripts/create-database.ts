import { createConnection } from 'mysql2/promise'
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
  const dbName = process.env['DATABASE_NAME'] ?? 'app_db'

  const connection = await createConnection({
    host: process.env['DATABASE_HOST'] ?? 'localhost',
    port: Number(process.env['DATABASE_PORT'] ?? 3306),
    user: process.env['DATABASE_USER'] ?? 'root',
    password: process.env['DATABASE_PASSWORD'] ?? 'root',
  })

  await connection.execute(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )

  console.log(`✅ Base de datos "${dbName}" lista.`)
  await connection.end()
}

main().catch((err: unknown) => {
  console.error('❌ Error creando la base de datos:', err)
  process.exit(1)
})
