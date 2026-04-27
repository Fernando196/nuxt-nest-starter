import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Example } from './entities/example.entity'
import { ExampleRepository } from './repositories/example.repository'
import { ExampleService } from './example.service'
import { ExampleController } from './example.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [
    ExampleService,
    ExampleRepository,  // ← Patrón Repository: inyectado como provider
  ],
  exports: [ExampleService],
})
export class ExampleModule {}
