/**
 * Property.js
 * Genesis Project - Connector Class
 * @author: C. Moller <xavier.tnc@gmail.com>
 * @date: 19 Apr 2019
 */

const log = window.__DEBUG_LEVEL__ ? console.log : function(){};


export class Property {

	constructor(id, type, name, value)
	{
		this.id = id;
		this.type = type;
		this.name = name;
		this.value = value;
	}

}