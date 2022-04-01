import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeleteResult } from 'typeorm'
import { Dfa } from './dfa.entity'
import { generateSecret, verifyToken } from "node-2fa"

@Injectable()
export class DfaService {
	constructor(
		@InjectRepository(Dfa)
		private dfaRepository: Repository<Dfa>
	) {}

	async insert(name: string): Promise<Dfa> {
		const MFA = generateSecret({ name: "ft_transcendence", account: name });
		return this.dfaRepository.save({ qr: MFA.qr, secret: MFA.secret, uri:MFA.uri });
	}

	verifySecret(secret: string, code: string): boolean {
		return verifyToken(secret, code)?.delta === 0;
	}

	async remove(id: number): Promise<DeleteResult> {
		return this.dfaRepository.delete({ id: id });
	}
}
