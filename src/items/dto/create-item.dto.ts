import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly qty: number;
}
