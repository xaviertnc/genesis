/**
 * Block.js
 * Genesis Project - Connector Class
 * @author: C. Moller <xavier.tnc@gmail.com>
 * @date: 19 Apr 2019
 */

import { Connector } from './Connector.js';


const log = window.__DEBUG_LEVEL__ ? console.log : function(){};


export class Block {

  constructor(id, app, dna, pos)
  {
    this.id = id;
    this.app = app;
    this.dna = dna;
    this.type = dna.block;
    this.position = pos;
    this.assembled = false;
    this.connectors = [];
    this.properties = {};
    this.traits = {};

    const block = this;

    // Add Traits
    // Realy bad implementation!
    // log('Block: ', block.type, ' - TRAITS');
    for (let traitName in dna.traits)
    {
      block.traits[traitName] = app.genesis.traits[traitName][dna.traits[traitName]];
    }

    // Add Properties
    // log('Block: ', block.type, ' - PROPS');
    dna.has.forEach(function (propType)
    {
      const propTypeTrait = block.traits[propType];
      //Pick a random property of the current type.  E.g. Pick a "size" out of all "sizes"!
      if (propTypeTrait === undefined)
      {
        const propTypeProps = app.genesis.getPropertiesByType(propType);
        block.properties[propType] = propTypeProps[Math.floor(Math.random() * propTypeProps.length)];
      }
      else
      {
        block.properties[propType] = propTypeTrait(block);
      }
      // log(propType, ' =', block.properties[propType]);
    });

    // Add Connectors
    // log('Block: ', block.type, ' - CONNECTORS');
    dna.wants.forEach(function (wanted_block)
    {
      const n = block.getHowManyConnectorsFor(wanted_block);
      for (let i = 0; i < n; i++)
      {
        const connector = new Connector(block, wanted_block.type);

        //log('Connector: ', wanted_block.type, ' - PROPS');
        //Add Connector Properties
        for (let propType in wanted_block.connector.props)
        {
          const prop = wanted_block.connector.props[propType];
          const propValueGenerator = app.genesis.dotGet(app.genesis.generators, prop.gen);
          const propValue = propValueGenerator(block, connector, prop);
          //log('Connector', propType, ': def =', prop, ', value = ', propValue);
          connector.properties[propType] = propValue;
        }

        //Add Connector Conditions
        //log('Connector: ', wanted_block.type, ' - CONDITIONS');
        wanted_block.connector.conditions.forEach(function (conditionName) {
          connector.conditions[conditionName] = app.genesis.conditions[conditionName]
        });

        block.connectors.push(connector);
      }
    });
  }


  getPropByType(type)
  {
    return this.properties[type] || {};
  }


  getProp(type, def)
  {
    var prop = this.getPropByType(type);
    return prop.value ? prop.value : def;
  }


  getPropName(type, def)
  {
    var prop = this.properties[type];
    return prop ? prop.name : def;
  }


  getHowManyConnectorsFor(wanted_block)
  {
    if (wanted_block.count) { return wanted_block.count; }
    if (wanted_block.min && wanted_block.max) {
      return (Math.random()*(wanted_block.max - wanted_block.min) + wanted_block.min)|0;
    }
    else if (wanted_block.min) { return wanted_block.min; }
    else if (wanted_block.max) { return (Math.random()*wanted_block.max)|0; }
    return 1;
  }


  getConnectorsByType(connector_wanted_type)
  {
    return this.connectors.filter(function (this_connector) {
      return (this_connector.wants === connector_wanted_type)
    });
  }


  getFreeConnectorsByType(connector_wanted_type)
  {
    return this.connectors.filter(function (this_connector) {
      return ( ! this_connector.connected() && this_connector.wants === connector_wanted_type);
    });
  }


  getConnectorConnectedTo(connected_block)
  {
    return this.connectors.find(function (this_connector) { return (this_connector.connected_to === connected_block); });
  }


  getConnectedConnectors()
  {
    return this.connectors.filter(function (this_connector) { return this_connector.connected(); });
  }


  getConnectedBlocks()
  {
    var connected_connectors = this.getConnectedConnectors();
    return connected_connectors.map(function (connector) { return connector.connected_to; });
  }


  /**
   *
   * Check if THIS block has an UNASSIGNED connector that wants a block of "type" that
   * also has the connector property values specified in "conditions"
   *
   * @param string connector_wanted_type
   * @param object conditions  { prop1:value1, prop2:value2, ... }
   *
   */
  hasFreeConnectorWith(connector_wanted_type, conditions)
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
  }



  /**
   *
   * Check if THIS block has a connector that wants a block of "type" that
   * also has the connector property values specified in "conditions"
   *
   * @param string connector_wanted_type
   * @param object conditions  { prop1:value1, prop2:value2, ... }
   *
   */
  hasConnectorWith(type, conditions)
  {
    var connectors, result;
    conditions = conditions || {};
    connectors = this.getConnectorsByType(type);
    result = connectors.find(function (connector) {
      var condition, found = true;
      //log('connector = ', connector);
      for (condition in conditions) {
        //log('connector.getProp(condition) = ', connector.getProp(condition));
        // We perform the comparison in reverse, i.e. !== to ensure that ALL the conditions are met and NOT just one.
        if (connector.getProp(condition) !== conditions[condition]) { found = false; break; }
      }
      return found;
    });
    //log('Block::hasConnectorWith, type = ', type, ', cond: ', conditions, ', candidates =', connectors,  ', result = ', result);
    return result;
  }


  canConnect(this_connector, other_connector)
  {
    var test_name, block, other_block, test_function, test_result, this_conditions;

    block = this_connector.parent;

    other_block = other_connector.parent;

    this_conditions = this_connector.conditions;

    //other_conditions = other_connector.conditions;  Check both sides?

    // We use a FOR loop here so we can Break on FAIL!
    test_result = true;
    for (test_name in this_conditions)
    {
      test_function = this_conditions[test_name];
      //log('Testing canConnect() with: ', other_block.type, ', result =', test_result);
      if ( ! test_function(block, this_connector, other_block, other_connector)) {
        test_result = false;
        break;
      }
    }

    //log('canConnect to ', other_block.type, ' with conditions = ', this_conditions, ', result = ', test_result);

    return test_result;
  }


  connectTo(other_block)
  {
    var result, block = this;

    result = block.connectors.find(function (this_connector)
    {
      var i, other_block_connectors, other_connector;
      //log('Check ', other_block.type, ' connector: ', this_connector);
      if ( ! this_connector.connected() && this_connector.wants === other_block.type)
      {
        //log('this_connector_wants = ', this_connector.wants, ' and is available');
        other_block_connectors = other_block.getFreeConnectorsByType(block.type);

        for (i = 0; i < other_block_connectors.length; i++)
        {
          other_connector = other_block_connectors[i];

          if (block.canConnect(this_connector, other_connector))
          {
            this_connector.connected_to = other_block;
            other_connector.connected_to = block;
            //log('Connecting', block, ' to', other_block, ', this_connector: ', this_connector, ', other_connector: ', other_connector);
            return true;
          }
        }
      }
    });

    //log('connectTo: ', other_block.type, ', result =', result);

    return result;
  }


  //attach(parent_pos, connector_offset)
  //{
    //if (this.attached) { return; }

    //this.position = {
      //x: (parent_pos.x + connector_offset.x),
      //y: (parent_pos.y + connector_offset.y)
    //};

    //this.attached = true;
  //}


  render()
  {
    var color_prop, width_prop, height_prop;

    color_prop  = this.getPropByType('color');
    width_prop  = this.getPropByType('width');
    height_prop = this.getPropByType('height');

    return '<div class="block" style="background-color: ' + color_prop.value + '; left: '
      + this.position.x.toString() + 'px; top: ' + this.position.y.toString() + 'px; width: '
      + ((width_prop.value/3)|0).toString() + 'px; height: ' + ((height_prop.value/3)|0).toString() + 'px;"></div>';
  }

}