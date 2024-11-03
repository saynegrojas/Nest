// import * as mongoose from 'mongoose';

// export const ItemSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   qty: Number,
// });

import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: String;

  @Prop()
  qty: Number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
