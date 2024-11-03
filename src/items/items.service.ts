import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './interfaces/item.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Name } from './types/item.type';

@Injectable()
export class ItemsService {
  constructor(@InjectModel('Item') private readonly itemModel: Model<Item>) {}

  // Query Param
  async findAll(description?: Name): Promise<Item[]> {
    if (description) {
      return await this.itemModel
        .find({ description: new RegExp(description, 'i') })
        .exec();
    }
    return await this.itemModel.find();
  }

  // Param
  async findAllByDescription(type: string): Promise<Item[]> {
    return await this.itemModel
      .find({ description: new RegExp(type, 'i') })
      .exec();
  }

  async findAllByQty(amount: number): Promise<Item[]> {
    return await this.itemModel.find({ qty: amount }).exec();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findOne({ _id: id }).exec();

    if (!item) {
      throw new NotFoundException(`No item was found with matching id: ${id}`);
    }
    return item;
  }

  async create(item: Item): Promise<Item> {
    const newItem = new this.itemModel(item);
    return await newItem.save();
  }

  async update(id: string, item: Item): Promise<Item> {
    const updatedItem = await this.itemModel.findByIdAndUpdate(id, item, {
      new: true,
    });

    if (!updatedItem) {
      throw new NotFoundException(`No item was found with matching id: ${id}`);
    }
    return updatedItem;
  }
  async delete(id: string): Promise<Item> {
    const item = await this.itemModel.findByIdAndDelete(id);

    if (!item) {
      throw new NotFoundException(`No item was found with matching id: ${id}`);
    }

    return item;
  }

  // async create(item: Item): Promise<Item> {
  //   const newItem = new this.itemModel(item);
  //   return await newItem.save();
  // }

  // async delete(id: string): Promise<Item> {
  //   return await this.itemModel.findByIdAndRemove(id);
  // }

  // async update(id: string, item: Item): Promise<Item> {
  //   return await this.itemModel.findByIdAndUpdate(id, item, { new: true });
  // }
}
