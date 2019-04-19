/**
 * Maak wereld vol "blocks"
 *
 * Kies random vir elke blok:
 *    - die aantal konnektors
 *
 * Kies 'n "seed" blok
 *
 * Selekteer al die blokke binne x? radius en kies die beste match vir elke
 * konneksie punt
 *
 * Ons moet die omgewing scan asook alle nabye entiteite want hulle verhoog sekere waarskynlikhede.
 *
 * Nabye omgewing en entiteite kan veroorsaak dat 'n blok konnekteer met 'n ander entiteit of selfs net eienskappe erf.
 * Eienskap waardes kan ook nader wees aan die omgewing gemiddeld.
 *
 * traits
 *
 * Om vinniger en meer spesifieke resultate te kry moet daar ook 'n versameling van verskillende saamgestelde entiteit DNA patrone te wees.
 *
 * Die DNA in 'n blok word verteenwwordig deur die blok se gedrag reels. AI? Behaviours?
 *
 * 'n Blok kan byvoorbeeld 'n "human" komponent wees met "human" DNA. Die blok "query" dan die DNA vir die korrekte gedrag gebaseer op sy tiepe
 *  en moontlik ander faktore.
 *
 * Die detail vlak van evolusie van unieke items en lewensvorme moet bepaal word.  Ons kan baie klein bou blokkies laat reageer met mekaar en kyk wat gebreur
 * of ons kan grooter en meer spesifieke komponente laat kombineer om net effens anderse tiepe entiteite te onwikkel.
 *
 */

var	Dice, Connector, Property, Trait, Block, Specimen, Species, Sector, Environment, World;


Connector = function (parent, wants)
{
	this.id = parent.connectors.length + 1;
	this.parent = parent;
	this.wants = wants;		//wants == block-type
	this.properties = {};
	this.conditions = {};
	this.connected_to = null;
	// this.pos = {};
};


Connector.prototype.connected = function ()
{
	return this.connected_to !== null;
};


Connector.prototype.getProp = function (prop, def)
{
	return this.properties[prop] || def;
};


Property = function (id, type, name, value)
{
	this.id = id;
	this.type = type;
	this.name = name;
	this.value = value;
};


Block = function (id, dna, pos)
{
	this.id = id;
	this.dna = dna;
	this.type = dna.block;
	this.position = pos;
	this.assembled = false;
	this.connectors = [];
	this.properties = {};
	this.traits = {};

	var i, n, connector, prop_type, prop, prop_value, condition, this_block = this;

	//Add Traits
	//Realy bad implementation!
	//console.log('Block: ', this_block.type, ' - TRAITS');
	for (prop_type in dna.traits) {
		this_block.traits[prop_type] = Dice.traits[prop_type][dna.traits[prop_type]];
	}

	//Add Properties
	//console.log('Block: ', this_block.type, ' - PROPS');
	dna.has.forEach(function (prop_type)
	{
		var prop_type_props, prop_type_trait;
		prop_type_trait = this_block.traits[prop_type];
		//Pick a random property of the current type.  E.g. Pick a "size" out of all "sizes"!
		if (prop_type_trait === undefined) {
			prop_type_props = Dice.getPropertiesByType(prop_type);
			this_block.properties[prop_type] = prop_type_props[(Math.random()*prop_type_props.length)|0];
		} else {
			this_block.properties[prop_type] = prop_type_trait(this_block);
		}
		//console.log(prop_type, ' =', this_block.properties[prop_type]);
	});

	//Add Connectors
	//console.log('Block: ', this_block.type, ' - CONNECTORS');
	dna.wants.forEach(function (wanted_block)
	{
		n = this_block.getHowManyConnectorsFor(wanted_block);
		for (i = 0; i < n; i++)
		{
			connector = new Connector(this_block, wanted_block.type);

			//console.log('Connector: ', wanted_block.type, ' - PROPS');
			//Add Connector Properties
			for (prop_type in wanted_block.connector.props)
			{
				prop = wanted_block.connector.props[prop_type];
				prop_value_generator = Dice.dotGet(Dice.generators, prop.gen);
				prop_value = prop_value_generator(this_block, connector, prop);
				//console.log('Connector', prop_type, ': def =', prop, ', value = ', prop_value);
				connector.properties[prop_type] = prop_value;
			}

			//Add Connector Conditions
			//console.log('Connector: ', wanted_block.type, ' - CONDITIONS');
			wanted_block.connector.conditions.forEach(function (condition_name) {
				connector.conditions[condition_name] = Dice.conditions[condition_name]
			});

			this_block.connectors.push(connector);
		}
	});
};


Block.prototype.getPropByType = function (type)
{
	return this.properties[type];
};


Block.prototype.getProp = function (type, def)
{
	var prop = this.properties[type];
	return prop ? prop.value : def;
};


Block.prototype.getPropName = function (type, def)
{
	var prop = this.properties[type];
	return prop ? prop.name : def;
};


Block.prototype.getHowManyConnectorsFor = function (wanted_block)
{
	if (wanted_block.count) { return wanted_block.count; }
	if (wanted_block.min && wanted_block.max) {
		return (Math.random()*(wanted_block.max - wanted_block.min) + wanted_block.min)|0;
	}
	else if (wanted_block.min) { return wanted_block.min; }
	else if (wanted_block.max) { return (Math.random()*wanted_block.max)|0; }
	return 1;
};


Block.prototype.getConnectorsByType = function (connector_wanted_type)
{
	return this.connectors.filter(function (this_connector) {
		return (this_connector.wants === connector_wanted_type)
	});
};


Block.prototype.getFreeConnectorsByType = function (connector_wanted_type)
{
	return this.connectors.filter(function (this_connector) {
		return ( ! this_connector.connected() && this_connector.wants === connector_wanted_type);
	});
};


Block.prototype.getConnectorConnectedTo = function (connected_block)
{
	return this.connectors.find(function (this_connector) { return (this_connector.connected_to === connected_block); });
};


Block.prototype.getConnectedConnectors = function ()
{
	return this.connectors.filter(function (this_connector) { return this_connector.connected(); });
};


Block.prototype.getConnectedBlocks = function ()
{
	var connected_connectors = this.getConnectedConnectors();
	return connected_connectors.map(function (connector) { return connector.connected_to; });
};


/**
 *
 * Check if THIS block has an UNASSIGNED connector that wants a block of "type" that
 * also has the connector property values specified in "conditions"
 *
 * @param string connector_wanted_type
 * @param object conditions  { prop1:value1, prop2:value2, ... }
 *
 */
Block.prototype.hasFreeConnectorWith = function (connector_wanted_type, conditions)
{
	conditions = conditions || {};
	var free_connectors = this.getFreeConnectorsByType(connector_wanted_type);
	return free_connectors.find(function (free_connector) {
		var condition, found = true;
		for (condition in conditions) {
			if (free_connector.getProp(condition) !== conditions[condition]) { found = false; break; }
		}
		return found;
	});
};



/**
 *
 * Check if THIS block has a connector that wants a block of "type" that
 * also has the connector property values specified in "conditions"
 *
 * @param string connector_wanted_type
 * @param object conditions  { prop1:value1, prop2:value2, ... }
 *
 */
Block.prototype.hasConnectorWith = function (type, conditions)
{
	var connectors, result;
	conditions = conditions || {};
	connectors = this.getConnectorsByType(type);
	result = connectors.find(function (connector) {
		var condition, found = true;
		//console.log('connector = ', connector);
		for (condition in conditions) {
			//console.log('connector.getProp(condition) = ', connector.getProp(condition));
			// We perform the comparison in reverse, i.e. !== to ensure that ALL the conditions are met and NOT just one.
			if (connector.getProp(condition) !== conditions[condition]) { found = false; break; }
		}
		return found;
	});
	//console.log('Block::hasConnectorWith, type = ', type, ', cond: ', conditions, ', candidates =', connectors,  ', result = ', result);
	return result;
};


Block.prototype.canConnect = function (this_connector, other_connector)
{
	var test_name, this_block, other_block, test_function, test_result, this_conditions;

	this_block = this_connector.parent;

	other_block = other_connector.parent;

	this_conditions = this_connector.conditions;

	//other_conditions = other_connector.conditions;  Check both sides?

	// We use a FOR loop here so we can Break on FAIL!
	test_result = true;
	for (test_name in this_conditions)
	{
		test_function = this_conditions[test_name];
		//console.log('Testing canConnect() with: ', other_block.type, ', result =', test_result);
		if ( ! test_function(this_block, this_connector, other_block, other_connector)) {
			test_result = false;
			break;
		}
	}

	//console.log('canConnect to ', other_block.type, ' with conditions = ', this_conditions, ', result = ', test_result);

	return test_result;
};


Block.prototype.connectTo = function (other_block)
{
	var result, this_block = this;

	result = this_block.connectors.find(function (this_connector)
	{
		var i, other_block_connectors, other_connector;
		//console.log('Check ', other_block.type, ' connector: ', this_connector);
		if ( ! this_connector.connected() && this_connector.wants === other_block.type)
		{
			//console.log('this_connector_wants = ', this_connector.wants, ' and is available');
			other_block_connectors = other_block.getFreeConnectorsByType(this_block.type);

			for (i = 0; i < other_block_connectors.length; i++)
			{
				other_connector = other_block_connectors[i];

				if (this_block.canConnect(this_connector, other_connector))
				{
					this_connector.connected_to = other_block;
					other_connector.connected_to = this_block;
					//console.log('Connecting', this_block, ' to', other_block, ', this_connector: ', this_connector, ', other_connector: ', other_connector);
					return true;
				}
			}
		}
	});

	//console.log('connectTo: ', other_block.type, ', result =', result);

	return result;
};


//Block.prototype.attach = function (parent_pos, connector_offset)
//{
	//if (this.attached) { return; }

	//this.position = {
		//x: (parent_pos.x + connector_offset.x),
		//y: (parent_pos.y + connector_offset.y)
	//};

	//this.attached = true;
//}


Block.prototype.render = function ()
{
	var color_prop, width_prop, height_prop;

	color_prop  = this.getPropByType('color');
	width_prop  = this.getPropByType('width');
	height_prop = this.getPropByType('height');

	return '<div class="block" style="background-color: ' + color_prop.value + '; left: '
		+ this.position.x.toString() + 'px; top: ' + this.position.y.toString() + 'px; width: '
		+ ((width_prop.value/3)|0).toString() + 'px; height: ' + ((height_prop.value/3)|0).toString() + 'px;"></div>';
};


Specimen = function (id) {
	this.id = id;
	this.blocks = [];
};


Specimen.prototype.pickSeedBlock = function (sector)
{
	var n, seedblock_index, seedblock;

	n = sector.seeds.length;

	seedblock_index = Math.random()*n|0;

	seedblock = sector.seeds[seedblock_index];

	this.blocks.push(seedblock);

	return seedblock;
};


/**
 *
 * Evolution for a single block inside an specimen.
 *
 * Repeat this function until it returns no attachments
 *
 * Once evolved, remove the attched block from the sector seed blocks collection.
 *
 */
Specimen.prototype.generate = function (specimen_block, sector, depth)
{
	depth = depth || 0; if (depth > 100) { return; } depth++;

	var i, target_block, specimen = this, attached = [];

	console.log('Specimen.generate() - SPECIMEN BLOCK =', specimen_block.type, ', SIDE =', specimen_block.getPropName('side'));

	sector.remove_seed(specimen_block);

	//console.dir(sector.seeds);
	for (i = 0; i < sector.seeds.length; i++)
	{
		target_block = sector.seeds[i];
		//console.log('Testing connect with block = ', target_block.type);
		// if (attached.find(function (attached_block) { return (attached_block.type === target_block.type); })) { continue; }
		if (specimen_block.connectTo(target_block)) {
			console.log('Block', target_block.type, ' connection successful!');
			attached.push(target_block);
			specimen.blocks.push(target_block);
		}
		if (attached.length === specimen_block.connectors.length) { break; }
	}

	sector.seeds = sector.seeds.filter(function (block) { return (attached.indexOf(block) < 0); });

	attached.forEach(function (attached_block) { specimen.generate(attached_block, sector, depth); });

};


Specimen.prototype.assemble = function (parent_block, parent_block_pos, depth)
{
	console.log('Assemble block: ', parent_block.type, ', pos =', parent_block_pos, ', depth =', depth);

	depth = depth || 0; if (depth > 100) { return; } depth++;

	var i, connected_connectors, parent_connector, connected_block, parent_connector_pos,
		connected_block_connector, connected_block_connector_offset, connected_block_pos;

	parent_block_pos = parent_block_pos || { x:0, y:0 };
	parent_block.position = parent_block_pos;
	parent_block.assembled = true;

	connected_connectors = parent_block.getConnectedConnectors();

	//console.log('connected_connectors: ', connected_connectors);
	for (i = 0; i < connected_connectors.length; i++)
	{
		parent_connector = connected_connectors[i];
		connected_block = parent_connector.connected_to;
		// Every parent block has a connector that links back to the previous parent block which is already assembled.
		// Don't re-assemble already assembled blocks!
		//console.log('connected_block: ', connected_block, ', assembled = ', connected_block.assembled);
		if ( ! connected_block.assembled)
		{
			parent_connector_pos = parent_connector.getProp('pos');
			connected_block_connector = connected_block.getConnectorConnectedTo(parent_block);
			connected_block_connector_offset = connected_block_connector.getProp('pos');
			connected_block_pos = {
				x: (parent_block_pos.x + parent_connector_pos.x - connected_block_connector_offset.x),
				y: (parent_block_pos.y + parent_connector_pos.y - connected_block_connector_offset.y)
			}
			this.assemble(connected_block, connected_block_pos, depth);
		}
	}

	//console.log('assemble - done');
	return;
};


Specimen.prototype.render = function (scale)
{
	scale = scale || 1;
	var i, block, block_class, block_layer, width, height, image_prop, img_src, html = '';

	for (i = 0; i < this.blocks.length; i++)
	{
		block = this.blocks[i];

		block_class = 'block'; //((i > 0) ? 'block-marker' : 'initial-block-marker');

		image_prop = block.getPropByType('image');

		if (image_prop) {
			width = image_prop.value.w;
			height = image_prop.value.h;
			block_layer = 'z-index: ' + image_prop.value.z + ';'
			img_src = 'img/' + image_prop.name + '.png';
		} else {
			width = block.getPropByType('width').value;
			height = block.getPropByType('height').value;
			block_layer = '';
			img_src = 'img/noimage.png';
		}

		html += '<div class="' + block_class + '" style="'
			+ 'left:'   + (((block.position.x - 2)*scale)|0).toString() + 'px;'
			+ 'top:'    + (((block.position.y - 2)*scale)|0).toString() + 'px;'
			+ 'width:'  + ((width*scale)|0).toString() + 'px;'
			+ 'height:' + ((height*scale)|0).toString() + 'px;'
			+ block_layer + '"><img src="' + img_src + '"></div>';
	}

	return html;
};


Species = function (id, name, dna) {
	this.id = id;
	this.name = name;
	this.dna = dna;
};


Sector = function (id, r, c, w, h, env) {
	this.id = id;
	this.row = r;
	this.col = c;
	this.width = w;
	this.height = h;

	this.environment = env;

	this.seeds = [];

	this.entities = [];
};


Sector.prototype.remove_seed = function (block) {
	this.seeds.splice(this.seeds.indexOf(block), 1);
};


Environment = function (id) {
	this.id = id;
	sectors = [];
};


World = function (id) {
	this.id = id;
	sectors = [];
};


//Condition = function (params)
//{
	//params = params || {};
	//this.name = params.name;
	//this.value = params.value || null;
	//this.fails = params.fails || null;
//};



Trait = function (params)
{
	params = params || {};
	this.prop = params.prop;
	this.exec = params.exec || null;
};


Dice = {
	traits: {
		side: {
			left_right: function () {
				 var side_props = Dice.getPropertiesByType('side');
				 return (Math.random() > 0.5) ? side_props[1] : side_props[0];
			},
			left_right_center: function () {
				var r = Math.random(), side_props = Dice.getPropertiesByType('side');
				if (r < 0.3333) { return side_props[0]; }
				if (r < 0.6666) { return side_props[1]; }
				return side_props[2];
			}
		},
		image: {
			left_right: function (block) {
				var available_props = [], prop_type = block.type + '_image';
				if (block.getProp('side') === 1) {
					available_props = Dice.properties.filter(function (prop) { return (prop.type === prop_type && prop.value.s === 'L'); });
				} else {
					available_props = Dice.properties.filter(function (prop) { return (prop.type === prop_type && prop.value.s === 'R'); });
				}
				return available_props[(Math.random()*available_props.length)|0];
			},
			left_right_center: function (block) {
				var available_props = [], prop_type = block.type + '_image';
				switch (block.getProp('side'))
				{
					case 1:
						available_props = Dice.properties.filter(function (prop) { return (prop.type === prop_type && prop.value.s === 'L'); });
						break;
					case 2:
						available_props = Dice.properties.filter(function (prop) { return (prop.type === prop_type && prop.value.s === 'R'); });
						break;
					case 3:
					default:
						available_props = Dice.properties.filter(function (prop) { return (prop.type === prop_type && prop.value.s === 'C'); });
				}
				return available_props[(Math.random()*available_props.length)|0];
			},
			random: function (block) {
				var available_props = [], prop_type = block.type + '_image';
				available_props = Dice.getPropertiesByType(prop_type);
				return available_props[(Math.random()*available_props.length)|0];
			}
		}
	},

	conditions: {
		want_same_side: function(parent_block, parent_connector, other_block, other_connector) {
			var this_side, other_side;
			this_side = parent_connector.properties.side;
			other_side = other_block.getPropName('side');
			if (! other_side) { other_side = other_connector.getProp('side'); }
			//console.log('Want-same-side: this-connector-side =', parent_block.type, ' -', this_side, ', other-side =', other_block.type, ' -', other_side);
			return (this_side === other_side);
		},
		want_parent_side: function(parent_block, parent_connector, other_block, other_connector) {
			var parent_side, other_side;
			parent_side = parent_block.getPropName('side');
			other_side = other_block.getPropName('side');
			if (! other_side) { other_side = other_connector.getProp('side'); }
			//console.log('Want-parent-side: parent-side =', parent_block.type, ' -', parent_side, ', other-side =', other_block.type, ' -', other_side);
			return (parent_side === other_side);
		}
	},

	generators: {
		connector: {
			side: function(parent_block, connector, params) {
				//console.log('gen::side(),  block =', parent_block.type, ', connector =', connector, ', params =', params);
				var i, n, options, side;
				choose = params.choose;
				options = params.options;
				switch (params.choose)
				{
					case 'random-free':	//Select a random available side
						n = options.length;
						for (i = 0; i < n; i++)
						{
							side = options[(Math.random()*options.length)|0];
							if ( ! parent_block.hasConnectorWith(connector.wants, {'side': side})) { return side; }
						}
						return options[(n/2)|0];

					case 'next-free': //Select the first available side
						switch (options.length)
						{
							case 1:
								return options[0];
							case 2:
								if (parent_block.hasConnectorWith(connector.wants, {'side': options[0]})) { return options[1]; }
								return options[0];
							case 3:
								if (parent_block.hasConnectorWith(connector.wants, {'side': options[0]})) {
									if (parent_block.hasConnectorWith(connector.wants, {'side': options[1]})) { return options[2]; }
									return options[1];
								}
								return options[0];
						}
						break;

					case 'opposite-parent-block-side':
						//console.log('gen::side(opposite-parent-block-side),  parent-block-side = ', parent_block.getProp('side'));
						switch (parent_block.getProp('side'))
						{
							case 1: return 'right';
							case 2: return 'left';
						}
						break;

					case 'parent-block-side':
						//console.log('gen::side(parent-block-side),  parent-block-side = ', parent_block.getProp('side'));
						switch (parent_block.getProp('side'))
						{
							case 1: return 'left';
							case 2: return 'right';
						}
						break;

					case 'opposite-wanted':
						console.log('gen::side(opposite-wanted), Do NOTHING for now!');
						break;

				}

			},
			pos: function(parent_block, connector, params) {
				//console.log('gen::pos(),  block =', parent_block, ', connector = ', connector, ', params =', params);
				var pos_rect, parent_width, parent_height, img, width, height, left_x, top_y, right_x, bottom_y;
				if (typeof params.choose === "string")
				{
					switch (params.choose)
					{
						case 'connector-side':
							pos_rect = params.options[connector.getProp('side')];
							break;
					}
				}
				else
				{
					pos_rect = params.choose;
				}
				parent_width = parent_block.getProp('width');
				if (parent_width) {
					parent_height = parent_block.getProp('height');
				} else {
					img = parent_block.getProp('image');
					parent_width = img.w;
					parent_height = img.h;
				}
				//console.log('parent_width =', parent_width, ', parent_height =', parent_height);
				//console.log('pos_rect =', pos_rect);
				if (pos_rect.unit === '%')
				{
					left_x = ((parent_width * pos_rect.top_left.x) / 100);
					right_x = ((parent_width * pos_rect.bottom_right.x) / 100);
					width = right_x - left_x;
					top_y = ((parent_height * pos_rect.top_left.y) / 100);
					bottom_y = ((parent_height * pos_rect.bottom_right.y) / 100);
					width = right_x - left_x;
					height = bottom_y - top_y;
					//console.log('left_x =', left_x, ', right_x =', right_x);
					return { x: (left_x + Math.random() * width)|0, y: (top_y + Math.random() * height)|0 };
				}
				width = pos_rect.bottom_right.x - pos_rect.top_left.x;
				height= pos_rect.bottom_right.y - pos_rect.top_left.y;
				return { x: (pos_rect.top_left.x + (Math.random * width)|0), y: (pos_rect.top_left.y + (Math.random() * height)|0) };
			}
		}
	},

	properties: [
		{ type: 'color',  name: 'Red',    value: 'red' },  //#FF0000
		{ type: 'color',  name: 'Green',  value: 'lime' }, //#00FF00
		{ type: 'color',  name: 'Blue',   value: 'blue' }, //#0000FF
		{ type: 'width',  name: 'Small',  value: 20 },
		{ type: 'width',  name: 'Medium', value: 40 },
		{ type: 'width',  name: 'Large',  value: 60 },
		{ type: 'height', name: 'Small',  value: 20 },
		{ type: 'height', name: 'Medium', value: 40 },
		{ type: 'height', name: 'Large',  value: 60 },
		{ type: 'weight', name: 'Light',  value: 1 },
		{ type: 'weight', name: 'Normal', value: 2 },
		{ type: 'weight', name: 'Heavy',  value: 3 },

		{ type: 'side',   name: 'left',   value: 1 },
		{ type: 'side',   name: 'right',  value: 2 },
		{ type: 'side',   name: 'center', value: 3 },

		{ type: 'head_image',  name: 'head1',  value: {w:72,h:89,z:2} },
		{ type: 'head_image',  name: 'head2',  value: {w:68,h:84,z:2} },
		{ type: 'hair_image',  name: 'hair1',  value: {w:64,h:25,z:3} },
		{ type: 'hair_image',  name: 'hair2',  value: {w:65,h:25,z:3} },
		{ type: 'eye_image',   name: 'eye1L',  value: {w:24,h:17,s:'L',z:3,i:1} },
		{ type: 'eye_image',   name: 'eye1R',  value: {w:24,h:17,s:'R',z:3,i:2} },
		{ type: 'eye_image',   name: 'eye1C',  value: {w:24,h:17,s:'C',z:4,i:3} },
		{ type: 'eye_image',   name: 'eye2L',  value: {w:24,h:17,s:'L',z:3,i:1} },
		{ type: 'eye_image',   name: 'eye2R',  value: {w:24,h:17,s:'R',z:3,i:2} },
		{ type: 'eye_image',   name: 'eye2C',  value: {w:24,h:17,s:'C',z:4,i:3} },
		{ type: 'mouth_image', name: 'mouth1', value: {w:32,h:8,z:3} },
		{ type: 'mouth_image', name: 'mouth2', value: {w:32,h:8,z:3} },
		{ type: 'nose_image',  name: 'nose1',  value: {w:23,h:30,z:3} },
		{ type: 'nose_image',  name: 'nose2',  value: {w:23,h:30,z:3} },
		{ type: 'ear_image',   name: 'ear1L',  value: {w:14,h:28,s:'L',z:1,i:1} },
		{ type: 'ear_image',   name: 'ear1R',  value: {w:14,h:28,s:'R',z:1,i:2} },
		{ type: 'ear_image',   name: 'ear2L',  value: {w:14,h:28,s:'L',z:1,i:1} },
		{ type: 'ear_image',   name: 'ear2R',  value: {w:14,h:28,s:'R',z:1,i:2} },
		{ type: 'neck_image',  name: 'neck1',  value: {w:32,h:28,z:1} },
		{ type: 'neck_image',  name: 'neck2',  value: {w:32,h:28,z:1} },
		{ type: 'torso_image', name: 'torso1', value: {w:129,h:128,z:3} },
		{ type: 'torso_image', name: 'torso2', value: {w:129,h:128,z:3} },
		{ type: 'arm_image',   name: 'arm1L',  value: {w:96,h:36,s:'L',z:2,i:1} },
		{ type: 'arm_image',   name: 'arm1R',  value: {w:96,h:36,s:'R',z:2,i:2} },
		{ type: 'arm_image',   name: 'arm2L',  value: {w:96,h:36,s:'L',z:2,i:1} },
		{ type: 'arm_image',   name: 'arm2R',  value: {w:96,h:36,s:'R',z:2,i:2} },
		{ type: 'hand_image',  name: 'hand1L', value: {w:48,h:48,s:'L',z:1,i:1} },
		{ type: 'hand_image',  name: 'hand1R', value: {w:48,h:48,s:'R',z:1,i:2} },
		{ type: 'hand_image',  name: 'hand2L', value: {w:48,h:48,s:'L',z:1,i:1} },
		{ type: 'hand_image',  name: 'hand2R', value: {w:48,h:48,s:'R',z:1,i:2} },
		{ type: 'hips_image',  name: 'hips1',  value: {w:129,h:75,z:3} },
		{ type: 'hips_image',  name: 'hips2',  value: {w:129,h:75,z:3} },
		{ type: 'leg_image',   name: 'leg1L',  value: {w:48,h:180,s:'L',z:2,i:1} },
		{ type: 'leg_image',   name: 'leg1R',  value: {w:48,h:180,s:'R',z:2,i:2} },
		{ type: 'leg_image',   name: 'leg2L',  value: {w:48,h:180,s:'L',z:2,i:1} },
		{ type: 'leg_image',   name: 'leg2R',  value: {w:48,h:180,s:'R',z:2,i:2} },
		{ type: 'foot_image',  name: 'foot1L', value: {w:64,h:48,s:'L',z:1,i:1} },
		{ type: 'foot_image',  name: 'foot1R', value: {w:64,h:48,s:'R',z:1,i:2} },
		{ type: 'foot_image',  name: 'foot2L', value: {w:64,h:48,s:'L',z:1,i:1} },
		{ type: 'foot_image',  name: 'foot2R', value: {w:64,h:48,s:'R',z:1,i:2} }
	],

	species_collection: [
		{ name: 'Human',    dna: HumanDNA },
		{ name: 'Species2',	dna: []	},
		{ name: 'Species3',	dna: []	},
		{ name: 'Species4',	dna: []	}
	],

	environments: [
		{
			name: 'Default',
			width: 10,
			height: 10,
			color: 0x0000FF
		},
		{
			name: 'alt',
			width: 10,
			height: 10,
			color: 0xFFFF00
		}
	]

};


Dice.getSpeciesByName = function (species_name)
{
	return Dice.species_collection.find(function (species) { return (species.name === species_name); });
};


Dice.getPropertiesByType = function (prop_type)
{
	return Dice.properties.filter(function (prop) { return (prop.type === prop_type); });
};


Dice.dotGet = function (context, dotKey)
{
	var keys, value = context;
	//console.log("dotKey = ", dotKey, ", context = ", context);
	keys = dotKey.split('.');
	keys.forEach(function (key) { value = value[key]; });
	//console.log("value = ", value);
	return value;
};


Dice.run = function ()
{
	var i, n, el, sector, species, dna_length, species_block_dna, pos, species_seed_block, environment, specimen, html;

	el = document.getElementById("content");

	html = "";

	species_name = "Human";

	environment_name = "Default";

	sector = new Sector(1, 1, 1, 300, 300, 1);

	species = Dice.getSpeciesByName(species_name);

	dna_length = species.dna.length;

	// Choose the number of seed blocks to generate in this sector
	//n = Math.ceil(Math.random()*sector.width*sector.height*0.01);
	n = (Math.random()*100)|0 + 100;

	for (i = 0; i < n; i++)
	{
		block_index = (Math.random()*dna_length)|0;
		species_block_dna = species.dna[block_index];

		pos = {
			x: (Math.random()*sector.width)|0,
			y: (Math.random()*sector.height)|0
		}

		specimen_seed_block = new Block(i, species_block_dna, pos);

		sector.seeds.push(specimen_seed_block);

		//html += specimen_seed_block.render();
	}


	specimen = new Specimen(1);

	specimen_seed_block = specimen.pickSeedBlock(sector);

	specimen.generate(specimen_seed_block, sector);

	console.dir(specimen);


	sector.entities.push(specimen);

	console.dir(sector);


	//html += specimen.render(0.1);

	specimen.assemble(specimen.blocks[0], {x:500, y:200});

	html += specimen.render();


	el.innerHTML = html;

	return false;
};

