import { Module } from '@nestjs/common';
import { PointTableController } from './point-table.controller';
import { PointTableService } from './point-table.service';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Point_table } from './point-table.entity';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Point_table]),TransactionsModule], // Importing the TypeORM module to define Transaction as a feature
  controllers: [PointTableController],
  providers: [PointTableService],
  exports:[PointTableService]
})
export class PointTableModule {}
