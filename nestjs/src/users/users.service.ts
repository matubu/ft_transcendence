import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DeleteResult } from 'typeorm';
import { Users } from './entity/users.entity';
import { UsersInterface } from './interfaces/users.interface';
import twofactor, { generateSecret, verifyToken } from "node-2fa";
const download = require('image-downloader');
const Jimp = require("jimp")
const md5 = require('md5');
const fs = require('fs');

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(Users)
		private usersRepository: Repository<Users>,
	) {}
	
	async insert(user_interface: UsersInterface)
	{
		const user = new Users();
		if (user_interface.id === undefined
			|| user_interface.fullname === undefined
			|| user_interface.twoauth === undefined
			|| user_interface.img === undefined
			|| user_interface.elo === undefined)
			return ;
		if ((await this.findOne(user_interface.id.toString())) !== undefined)
			return ;
		user.id = user_interface.id;
		user.fullname = user_interface.fullname;
		user.nickname = user_interface.nickname;
		user.twoauth = user_interface.twoauth;
		user.code2FA = user_interface.code2FA;
		user.img = user_interface.img;
		user.elo = user_interface.elo;
		await this.usersRepository.save(user)
	}

	async update(user_interface: UsersInterface) : Promise<boolean>
	{
		if (user_interface?.id === undefined)
			return false;
		let userUpdate = await this.usersRepository.findOne({ id: +user_interface.id })
		for (const key in userUpdate)
		{
			if (key !== "id" && key in user_interface)
				userUpdate[key] = user_interface[key];
		}
		const checkUser = await this.usersRepository.save(userUpdate)
		return (checkUser === userUpdate)
	}

	findAll(): Promise<Users[]> {
		return this.usersRepository.find();
	}

	strisdigit(id: string) : boolean
	{
		for (let i = 0; i < id.length; i++)
			if (id[i] < '0' || id[i] > '9')
				return (false);
		return (true);
	}

	findOne(id: string): Promise<Users> {
		if (id === undefined || !this.strisdigit(id))
			return ;
		return this.usersRepository.findOne({ id: +id });
	}

	async remove(id: string): Promise<DeleteResult> {
		const user: Users = await this.findOne(id);
		if (!user) return;
		fs.unlinkSync(process.cwd() + "/upload/images/" + user.img.substr(12));
		return await this.usersRepository.delete({ id: +id });
	}

	findRank(): Promise<Users[]> {
		return this.usersRepository.find({order: {elo: "DESC"}, take: 100});
	}

	findRankNumber(number: string): Promise<Users[]> {
		if (+number <= 0)
			return ;
		return this.usersRepository.find({order: {elo: "DESC"}, take: +number});
	}

	async check_code(id: string, code: string): Promise<boolean> {
		const user: Users = await this.findOne(id);
		if (!user) return false;
		return verifyToken(user.code2FA, code)?.delta === 0;
	}

	async activate_2fa(id: string): Promise<string>
	{
		const user: Users = await this.findOne(id);
		if (!user) return;
		if (user.code2FA) return;
		const secret = generateSecret({ name: "ft_transcendence", account: `${user.nickname ?? user.fullname}` });
		let updated: UsersInterface = {twoauth: true, code2FA: secret.secret, id: +id}
		await this.update(updated)
		return secret.qr;
	}

	async disable_2fa(id: string)
	{
		const user: Users = await this.findOne(id);
		if (!user) return;
		if (!user.code2FA) return;
		let updated: UsersInterface = {twoauth: false, code2FA: null, id: +id}
		await this.update(updated)
	}

	async add_friend(id_user: string, id_friend: number)
	{
		const user: Users = await this.findOne(id_user);
		if (!user) return;
		let updated: UsersInterface = {
			id: +id_user,
			friends: user.friends
		}
		updated.friends.push(id_friend);
		await this.update(updated)
	}

	RemoveElementFromIntArray(tab: number[], element: number): number[]{
		tab.forEach((value,index)=>{
			if(value==element) tab.splice(index,1);
		});
		return (tab)
	}

	async remove_friend(id_user: string, id_friend: number)
	{
		const user: Users = await this.findOne(id_user);
		if (!user) return;
		let updated: UsersInterface = {
			id: +id_user,
			friends: this.RemoveElementFromIntArray(user.friends, id_friend)
		}
		await this.update(updated)
	}

	async findByContent(str: string) : Promise<Users[]>
	{
		if (str.length < 3)
			return ;
		return await this.usersRepository.find( {
												where: [{ fullname: ILike(`%${str}%`) },
														{ nickname: ILike(`%${str}%`) }]
												});
	}

	async downloadImgByUrl(url_img: string): Promise<string>
	{
		const options = {
			url: url_img,
			dest: process.cwd() + "/upload/tmp"
		}

		const file = await download.image(options).then(({ filename }) => { return filename })
		const img_name = md5(Date.now()) + ".jpg";
		await Jimp.read(file)
		  .then(image => {
			return image
				.resize(256, Jimp.AUTO)
				.quality(60)
				.write(process.cwd() + "/upload/images/" + img_name)
		})
		const final_url = "/api/images/" + img_name;
		fs.unlinkSync(file);
		return (final_url);
	}

	async convert(filename: string) : Promise<string>
	{
		const file = process.cwd() + "/upload/tmp/" + filename;
		const img_name = md5(Date.now()) + ".jpg";
		await Jimp.read(file)
		  .then(image => {
			return image
				.resize(256, Jimp.AUTO)
				.quality(60)
				.write(process.cwd() + "/upload/images/" + img_name)
		})
		const final_url = "/api/images/" + img_name;
		fs.unlinkSync(file);
		return (final_url);
	}
}
