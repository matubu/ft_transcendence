import { Injectable } from '@nestjs/common';
const axios = require('axios')

@Injectable()
export class AlcoholService {
	async isAlcohol(search: string): Promise<boolean>
	{
		const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=";
		const result = await axios.get(url + search)
				.then(res => res['data']['ingredients'])
		
		if (result == null || result == undefined)
			return false;
		
		const name: string = result[0]['strIngredient'];
		const alcohol: boolean = result[0]['strAlcohol'] == "Yes" ? true : false;
		
		if (alcohol && name.toLowerCase === search.toLowerCase)
			return true;
		
		return false;
	}
}
