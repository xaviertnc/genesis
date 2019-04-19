/**
 * Species.js
 * Genesis Project - Connector Class
 * @author: C. Moller <xavier.tnc@gmail.com>
 * @date: 19 Apr 2019
 */

const log = window.__DEBUG_LEVEL__ ? console.log : function(){};


export class Species {

	constructor(id, name, dna)
	{
		this.id = id;
		this.name = name;
		this.dna = dna;
	}

}