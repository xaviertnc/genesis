// main.js

import { Block } from './classes/Block.js';
import { Sector } from './classes/Sector.js';
import { Specimen } from './classes/Specimen.js';

// import { World } from './classes/World.js';
// import { Trait } from './classes/Trait.js';
// import { Species } from './classes/Species.js';
// import { Property } from './classes/Property.js';
// import { Environment } from './classes/Environment.js';


const log = window.__DEBUG_LEVEL__ ? console.log : function(){};


window.app = {};

window.app.genesis = {

  traits: {

    side: {

      left_right: function () {
         var side_props = app.genesis.getPropertiesByType('side');
         return (Math.random() > 0.5) ? side_props[1] : side_props[0];
      },

      left_right_center: function () {
        var r = Math.random(), side_props = app.genesis.getPropertiesByType('side');
        if (r < 0.3333) { return side_props[0]; }
        if (r < 0.6666) { return side_props[1]; }
        return side_props[2];
      }

    },

    image: {

      left_right: function (block) {
        var available_props = [], prop_type = block.type + '_image';
        if (block.getProp('side') === 1) {
          available_props = app.genesis.properties.filter(
            prop => prop.type === prop_type && prop.value.s === 'L'
          );
        } else {
          available_props = app.genesis.properties.filter(
            prop => prop.type === prop_type && prop.value.s === 'R'
          );
        }
        return available_props[(Math.random()*available_props.length)|0];
      },

      left_right_center: function (block) {
        var available_props = [], prop_type = block.type + '_image';
        switch (block.getProp('side'))
        {
          case 1:
            available_props = app.genesis.properties.filter(
              prop => prop.type === prop_type && prop.value.s === 'L'
            );
            break;
          case 2:
            available_props = app.genesis.properties.filter(
              prop => prop.type === prop_type && prop.value.s === 'R'
            );
            break;
          case 3:
          default:
            available_props = app.genesis.properties.filter(
              prop => prop.type === prop_type && prop.value.s === 'C'
            );
        }
        return available_props[Math.floor(Math.random() * available_props.length)];
      },

      random: function (block) {
        var available_props = [], prop_type = block.type + '_image';
        available_props = app.genesis.getPropertiesByType(prop_type);
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
      //log('Want-same-side: this-connector-side =', parent_block.type, ' -', this_side, ', other-side =', other_block.type, ' -', other_side);
      return (this_side === other_side);
    },

    want_parent_side: function(parent_block, parent_connector, other_block, other_connector) {
      var parent_side, other_side;
      parent_side = parent_block.getPropName('side');
      other_side = other_block.getPropName('side');
      if (! other_side) { other_side = other_connector.getProp('side'); }
      //log('Want-parent-side: parent-side =', parent_block.type, ' -', parent_side, ', other-side =', other_block.type, ' -', other_side);
      return (parent_side === other_side);
    }

  },


  generators: {

    connector: {

      side: function(parent_block, connector, params)
      {
        //log('gen::side(),  block =', parent_block.type, ', connector =', connector, ', params =', params);
        let i, n, side;
        const choose = params.choose;
        const options = params.options;
        switch (params.choose)
        {
          case 'random-free': //Select a random available side
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
            //log('gen::side(opposite-parent-block-side),  parent-block-side = ', parent_block.getProp('side'));
            switch (parent_block.getProp('side'))
            {
              case 1: return 'right';
              case 2: return 'left';
            }
            break;

          case 'parent-block-side':
            //log('gen::side(parent-block-side),  parent-block-side = ', parent_block.getProp('side'));
            switch (parent_block.getProp('side'))
            {
              case 1: return 'left';
              case 2: return 'right';
            }
            break;

          case 'opposite-wanted':
            log('gen::side(opposite-wanted), Do NOTHING for now!');
            break;

        }

      }, // end: side()

      pos: function(parent_block, connector, params)
      {
        //log('gen::pos(),  block =', parent_block, ', connector = ', connector, ', params =', params);
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
        //log('parent_width =', parent_width, ', parent_height =', parent_height);
        //log('pos_rect =', pos_rect);
        if (pos_rect.unit === '%')
        {
          left_x = ((parent_width * pos_rect.top_left.x) / 100);
          right_x = ((parent_width * pos_rect.bottom_right.x) / 100);
          width = right_x - left_x;
          top_y = ((parent_height * pos_rect.top_left.y) / 100);
          bottom_y = ((parent_height * pos_rect.bottom_right.y) / 100);
          width = right_x - left_x;
          height = bottom_y - top_y;
          //log('left_x =', left_x, ', right_x =', right_x);
          return { x: (left_x + Math.random() * width)|0, y: (top_y + Math.random() * height)|0 };
        }

        width = pos_rect.bottom_right.x - pos_rect.top_left.x;
        height = pos_rect.bottom_right.y - pos_rect.top_left.y;

        return {
          x: (pos_rect.top_left.x + (Math.random * width)|0),
          y: (pos_rect.top_left.y + (Math.random() * height)|0)
        };

      } // end: pos()

    } // end: connector

  }, // end: generators


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
  ], // end: properties

  species_collection: [
    { name: 'Human',    dna: HumanDNA },
    { name: 'Species2', dna: [] },
    { name: 'Species3', dna: [] },
    { name: 'Species4', dna: [] }
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
  ],


  getSpeciesByName: function (speciesName)
  {
    return app.genesis.species_collection.find(species => species.name === speciesName);
  },


  getPropertiesByType: function (prop_type)
  {
    return app.genesis.properties.filter(prop => prop.type === prop_type);
  },


  dotGet: function (context, dotKey)
  {
    var keys, value = context;
    //log("dotKey = ", dotKey, ", context = ", context);
    keys = dotKey.split('.');
    keys.forEach(key => { value = value[key]; });
    //log("value = ", value);
    return value;
  },


  run: function ()
  {

    let html = "";

    const speciesName = 'Human';
    const environmentName = 'Default';
    const elmContent = document.getElementById('content');

    /**
     * World sector
     * @type {Sector} Sector(id, world_row, world_col, sector_w, sector_h, env)
     */
    const sector = new Sector(0, 0, 0, 580, 580, 1);

    const species = app.genesis.getSpeciesByName(speciesName);

    const speciesBlockCount = species.dna.length;

    // Choose the number of seed blocks to generate in this sector
    //n = Math.ceil(Math.random()*sector.width*sector.height*0.01);
    const n = (Math.random()*100)|0 + 100;

    for (let i = 0; i < n; i++)
    {
      const blockIndex = (Math.random() * speciesBlockCount) | 0;
      const speciesBlockDna = species.dna[blockIndex];
      const pos = {
        x: (Math.random() * sector.width ) | 0,
        y: (Math.random() * sector.height) | 0
      }

      /**
       * seedBlock
       * @type {Block} Block(id, app, dna, pos)
       */
      const seedBlock = new Block(i, app, speciesBlockDna, pos);

      sector.addSeedBlock(seedBlock);

      //html += seedBlock.render();
    }


    const specimen = new Specimen(1, {x:10, y:10});

    const remainingBlocks = specimen.generate(sector.pickRandomSeedBlock(), sector.getSeedBlocks());

    if (remainingBlocks) { sector.setSeedBlocks(remainingBlocks); }

    log('Specimen:', specimen);


    sector.addEntity(specimen);

    log('Sector:', sector);


    //html += specimen.render(0.1);

    specimen.assemble();

    html += specimen.render();


    elmContent.innerHTML = html;

    return false;
  }

}; // end: genesis