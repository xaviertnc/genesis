/**
 * Sector.js
 * Genesis Project - Connector Class
 * @author: C. Moller <xavier.tnc@gmail.com>
 * @date: 19 Apr 2019
 */

const log = window.__DEBUG_LEVEL__ ? console.log : function(){};


export class Sector {

  constructor(id, r, c, w, h, env)
  {
    this.id = id;
    this.row = r;
    this.col = c;
    this.width = w;
    this.height = h;
    this.environment = env;
    this.seedBlocks = [];
    this.entities = [];
  }


  // SEED BLOCKS

  getSeedBlocks()
  {
    return this.seedBlocks;
  }


  setSeedBlocks(seedBlocks)
  {
    this.seedBlocks = seedBlocks;
    return this;
  }


  addSeedBlock(seedBlock)
  {
    const seedBlocks = this.getSeedBlocks();
    seedBlocks.push(seedBlock);
    return this;
  }


  pickRandomSeedBlock()
  {
    const seedBlocks = this.getSeedBlocks();
    const blockIndex = Math.floor(Math.random() * seedBlocks.length);
    return seedBlocks[blockIndex];
  }


  removeSeedBlock(blockToRemove)
  {
    const seedBlocks = this.getSeedBlocks();
    this.setSeedBlocks(seedBlocks.filter(block => block !== blockToRemove));
    return this;
  }



  // ENTITIES

  getEntities()
  {
    return this.entities;
  }


  setEntities(entities)
  {
    this.entities = entities;
    return this;
  }


  addEntity(entity)
  {
    const entities = this.getEntities();
    entities.push(entity);
    return this;
  }

}