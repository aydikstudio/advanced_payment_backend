import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ScheduleModule } from '@nestjs/schedule'
import { TransactionModule } from './transaction/transaction.module'

@Module({
	imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), AuthModule, TransactionModule],
})
export class AppModule {}
