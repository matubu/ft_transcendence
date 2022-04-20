import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Block } from './block.entity';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Block]),
				forwardRef(() => UserModule)],
	providers: [BlockService],
	exports: [BlockService],
	controllers: [BlockController]
})
export class BlockModule {}
