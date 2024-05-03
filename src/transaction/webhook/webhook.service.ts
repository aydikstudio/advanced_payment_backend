import { Injectable } from "@nestjs/common";
import { PaymentStatusDto } from "src/lib/yookassa/types/yookassa.types";
import { PrismaService } from "src/prisma.service";


@Injectable()
export class WebhookService {
    constructor(private readonly prisma: PrismaService){}

    async yookassa(dto: PaymentStatusDto) {
        const {object} = dto

        const transaction = await this.prisma.transaction.findUnique({
            where: {
                paymentId: object.id
            },
            include: {
                user: true
            }
        })

        if(!transaction) {
            console.error('transaction not found')
            return
        }

        if(dto.event === 'payment.succeeded') {
            await this.prisma.transaction.update({
                where: {
                    id: transaction.id
                },
                data: {
                    status: object.status,
                    paymentMethod: object.payment_method.type
                }
            })

            await this.prisma.user.update({
                where: {
                    id: transaction.userId,
                },
                data: {
                    subscriptionEndDate: this.getEndDate(transaction.months)
                }
            })
        }
    }

    private getEndDate(months: number) {
        return new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)
    }
}