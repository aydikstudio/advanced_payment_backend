import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { YookassaService } from 'src/lib/yookassa/yookassa.service'
import { PrismaService } from 'src/prisma.service'
import { AutoRenewalService } from './auto-renewal.service'

import { TransactionController } from './transaction.controller'
import { TransactionService } from './transaction.service'
import { WebhookController } from './webhook/webhook.controller'
import { WebhookService } from './webhook/webhook.service'

@Module({
	imports: [HttpModule, ConfigModule],
	controllers: [TransactionController, WebhookController],
	providers: [
		PrismaService,
		AutoRenewalService,
		YookassaService,
		TransactionService,
		WebhookService,
	],
})
export class TransactionModule {}
