import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ExampleService, type PaginatedResult } from './example.service'
import { CreateExampleDto, UpdateExampleDto, ExampleQueryDto } from './dto/example.dto'
import type { Example } from './entities/example.entity'

@ApiTags('examples')
@ApiBearerAuth('access-token')
@Controller('examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: 'Listar examples con paginación y filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada de examples' })
  async findAll(@Query() query: ExampleQueryDto): Promise<PaginatedResult<Example>> {
    return this.exampleService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un example por ID' })
  @ApiResponse({ status: 200, description: 'Example encontrado' })
  @ApiResponse({ status: 404, description: 'Example no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Example> {
    return this.exampleService.findOne(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo example' })
  @ApiResponse({ status: 201, description: 'Example creado exitosamente' })
  @ApiResponse({ status: 422, description: 'Error de validación' })
  async create(@Body() dto: CreateExampleDto): Promise<Example> {
    return this.exampleService.create(dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un example' })
  @ApiResponse({ status: 200, description: 'Example actualizado' })
  @ApiResponse({ status: 404, description: 'Example no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExampleDto,
  ): Promise<Example> {
    return this.exampleService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un example (soft delete)' })
  @ApiResponse({ status: 204, description: 'Example eliminado' })
  @ApiResponse({ status: 404, description: 'Example no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.exampleService.remove(id)
  }
}
