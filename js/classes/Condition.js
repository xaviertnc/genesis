/**
 * Condition.js
 * Genesis Project - Connector Class
 * @author: C. Moller <xavier.tnc@gmail.com>
 * @date: 19 Apr 2019
 */

const log = window.__DEBUG_LEVEL__ ? console.log : function(){};


export class Condition {

	constructor(params)
	{
		params = params || {};
		this.name = params.name;
		this.value = params.value || null;
		this.fails = params.fails || null;
	}

}