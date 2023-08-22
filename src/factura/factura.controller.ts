import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaDto } from './dto/factura.dto';

@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  create(@Body() createFacturaDto) {
    return this.facturaService.create(createFacturaDto);
  }

  @Get()
  findAll() {
    return this.facturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFacturaDto: FacturaDto) {
    return this.facturaService.update(+id, updateFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturaService.remove(+id);
  }
}
