import { Controller, Post, Body, Req, Get, Param } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { FastifyRequest } from 'fastify';
import { Channels } from  './entity/channels.entity'
import { ChannelsInterface } from './interfaces/channels.interface';

@Controller('channels')
export class ChannelsController {
	constructor(private readonly channelsService: ChannelsService) {}

	@Post()
	async createChannel(@Body() channel: ChannelsInterface, @Req() req: FastifyRequest) : Promise<Channels>
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return;

		return await this.channelsService.createChannel(+validUser.value, channel);
	}

	@Get()
	async getAll(@Req() req: FastifyRequest) : Promise<Channels[]>
	{
		if (!req.cookies.user) return ;
		const validUser = req.unsignCookie(req.cookies.user);
		if (!validUser?.valid) return ;

		return await this.channelsService.getChannelUser(+validUser.value);
	}
}
