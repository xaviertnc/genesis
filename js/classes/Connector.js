/**
 * Connector.js
 * Genesis Project - Connector Class
 * @author: C. Moller <xavier.tnc@gmail.com>
 * @date: 19 Apr 2019
 */

const log = window.__DEBUG_LEVEL__ ? console.log : function(){};


export class Connector {

	constructor(parent, wants)
	{
		this.id = parent.connectors.length + 1;
		this.parent = parent;
		this.wants = wants;		//wants == block-type
		this.properties = {};
		this.conditions = {};
		this.connected_to = null;
		// this.pos = {};
	}


	connected()
	{
		return this.connected_to !== null;
	}


	getProp(prop, def)
	{
		return this.properties[prop] || def;
	}

}