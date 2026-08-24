import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsOptional } from "class-validator";

export class PaginationDTO {
  @ApiProperty({
    description: "Page number to fetch",
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  page: number;

  @ApiProperty({
    description: "Items per page",
    type: Number,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageSize: number;

  constructor(partial: Partial<PaginationDTO>) {
    Object.assign(this, partial);

    this.page = this.page || 1;
    this.pageSize = this.pageSize || 10;
  }
}
