import { IsNumber } from "class-validator";
import { ObjectPayment } from "src/lib/yookassa/types/yookassa.types";

export class CreateTransactionDto {
    @IsNumber()
    months: number

    @IsNumber()
    userId: number

    payment: ObjectPayment
}