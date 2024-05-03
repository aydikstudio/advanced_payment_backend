import { Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { YookassaService } from "src/lib/yookassa/yookassa.service";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { MakePaymentDto } from "./dto/make-payment.dto";
import { YookassaPaymentDto } from "src/lib/yookassa/dto/yookassa.dto";
import { YookassaPaymentResponse } from "./response/payment-response";
import { PrismaService } from "src/prisma.service";



@Injectable()
export class TransactionService {
    constructor(
		private readonly prisma: PrismaService,
		private readonly yookassa: YookassaService
    ){}

	async makePayment(
		{ months }: MakePaymentDto,
		user: User
	): Promise<YookassaPaymentResponse> {
		const price = 490

		const payment = await this.makeYooKassaPayment(
			user,

			price,
			months
		)

	

		return {
			confirmationToken: payment.confirmation.confirmation_token,
		}
	}
	
    async makeYooKassaPayment(user:User, price: number, months: number) {
        try {
            const paymentResponse = await this.yookassa.createPayment({
				currency: 'RUB',
				customerEmail: user.email,
				items: [
					{
						description: `Подписка, на ${months} мес.`,
						quantity: '1.00',
						amount: {
							value: price.toString(),
							currency: 'RUB',
						},
						vat_code: '1',
					},
				],
				total: price.toString(),
			})

			if (paymentResponse) {
				await this.create({
					payment: paymentResponse,
					userId: user.id,

					months,
				})
			}
		

			return paymentResponse
        } catch(error) {
            console.log('make russian payment error', error)
        }
    }

	async create({ userId, months, payment }: CreateTransactionDto) {
		return this.prisma.transaction.create({
			data: {
				months,
				amount: payment.amount.value,
				paymentId: payment.id,
				status: payment.status,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})
	}



	async update({ transactionId, months, payment }: UpdateTransactionDto) {
		const paymentData = payment
			? {
					amount: payment.amount.value,
					paymentId: payment.id,
					paymentMethod: payment.payment_method.type,
					status: payment.status,
				}
			: {}

		return this.prisma.transaction.update({
			where: {
				id: transactionId,
			},
			data: {
				months,
				...paymentData,
			},
		})
	}
}