import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ValidationPipe,
  Ip,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { Item } from './interfaces/item.interface';
import { Name } from './types/item.type';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { LoggerService } from '../logger/logger.service';

// Skip the default throttler limit to all the routes
@SkipThrottle()
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // instaniate new logger service with context of itemController logger only for items controller
  private readonly loggerService = new LoggerService(ItemsController.name);

  // Optional Query Param
  @Throttle({ short: { ttl: 1000, limit: 1 } })
  @Get()
  findAll(
    @Ip() ip: string,
    @Query('description') description?: Name,
  ): Promise<Item[]> {
    this.loggerService.log(
      `Request for all items\t${ip}`,
      ItemsController.name,
    );
    return this.itemsService.findAll(description);
  }

  // Param
  // order matters when it comes to params
  @Get('description/:type')
  findAllByDescription(@Param('type') type: string): Promise<Item[]> {
    return this.itemsService.findAllByDescription(type);
  }

  @Get('qty/:amount')
  findAllByQty(@Param('amount', ParseIntPipe) amount: number): Promise<Item[]> {
    return this.itemsService.findAllByQty(amount);
  }

  // Override the skip throttler and override the default or "short" limiter
  @Throttle({ short: { ttl: 1000, limit: 1 } })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Item> {
    this.loggerService.log(`Request for item\t${id}`, ItemsController.name);
    return this.itemsService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Put(':id')
  update(
    @Body() updateItemDto: CreateItemDto,
    @Param('id') id: string,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Item> {
    return this.itemsService.delete(id);
  }
}
