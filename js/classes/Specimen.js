/**
 * Specimen.js
 * Genesis Project - Connector Class
 * @author: C. Moller <xavier.tnc@gmail.com>
 * @date: 19 Apr 2019
 */

const log = window.__DEBUG_LEVEL__ ? console.log : function(){};


export class Specimen {

	constructor(id, pos)
	{
		this.id = id;
		this.position = pos || { x:0, y:0 };
		this.bounds = {};
		this.blocks = [];
	};


	/**
	 *
	 * Evolution for a single block inside an specimen.
	 *
	 * Repeat this function until it returns no attachments
	 *
	 */
	generate(specimenBlock, availableBlocks, depth = 0)
	{
		log('Specimen.generate() - SPECIMEN BLOCK =', specimenBlock.type,
			', SIDE =', specimenBlock.getPropName('side'));

		if (depth < 100) { depth++; } else { return; }

		if ( ! availableBlocks || ! availableBlocks.length) { return; }

		let attached = [];

		const specimen = this;

		specimen.blocks.push(specimenBlock);

		// Remove the current specimen block from the block pool!
		availableBlocks = availableBlocks.filter(block => block !== specimenBlock);

		//log('Block Pool:', availableBlocks);
		for (let i = 0; i < availableBlocks.length; i++)
		{
			/**
			 * The next available block to check and see isf it
			 * can be connected to the currently selected block.
			 * @type {Block}
			 */
			const availableBlock = availableBlocks[i];

			//log('Testing CAN-connect with block = ', availableBlock.type);
			if (specimenBlock.connectTo(availableBlock)) {
				log('Block', availableBlock.type, ' connection successful!');
				attached.push(availableBlock);
			}
			if (attached.length === specimenBlock.connectors.length) { break; }
		}

		// availableBlocks = availableBlocks.filter(block => attached.indexOf(block) < 0);
		attached.forEach(function (attachedBlock) {
			availableBlocks = specimen.generate(attachedBlock, availableBlocks, depth);
		});

		return availableBlocks;
	}


  /**
   * Recursive specimen block assembler
   */
	assemble(currentBlock, currentBlockPos, depth = 0)
	{
		// "depth" prevents infinate recursion!
		if (depth > 100) { return; }
		depth++;

		if ( ! this.blocks.length) { return; }

		if ( ! currentBlock)
		{
			currentBlock = this.blocks[0];
			currentBlockPos = this.position;
			this.bounds.top = currentBlockPos.y;
			this.bounds.left = currentBlockPos.x;
			this.bounds.bottom = currentBlockPos.y;
			this.bounds.right = currentBlockPos.x;
		}

		log('Assemble block: ', currentBlock.type, ', currentBlockPos =', currentBlockPos, ', depth =', depth);

		currentBlock.assembled = true;
		currentBlock.position = currentBlockPos;
		log('currentBlock: ', currentBlock);

		const connectedConnectors = currentBlock.getConnectedConnectors();
		//log('connectedConnectors: ', connectedConnectors);

		for (let i = 0; i < connectedConnectors.length; i++)
		{
			const connector = connectedConnectors[i];
			const connectedBlock = connector.connected_to;
			log('connectedBlock: ', connectedBlock, ', assembled =', connectedBlock.assembled);

			const imageProp = connectedBlock.getPropByType('image');
			const connectedBlockW = imageProp ? imageProp.value.w : connectedBlock.getProp('width' , 3);
			const connectedBlockH = imageProp ? imageProp.value.h : connectedBlock.getProp('height', 3);
			log('connectedBlockW =', connectedBlockW);
			log('connectedBlockH =', connectedBlockH);

			// Every block has a connector that links back to the previous block assembled.
			// Don't re-assemble already assembled blocks!
			if ( ! connectedBlock.assembled)
			{
				const connectorPos = connector.getProp('pos');
				const connectedBlockConnector = connectedBlock.getConnectorConnectedTo(currentBlock);
				const connectedBlockConnectorOffset = connectedBlockConnector.getProp('pos');
				const connectedBlockX = currentBlockPos.x + connectorPos.x - connectedBlockConnectorOffset.x;
				const connectedBlockY = currentBlockPos.y + connectorPos.y - connectedBlockConnectorOffset.y;
				const connectedBlockPos = { x: connectedBlockX,	y: connectedBlockY };
				log('connectedBlockPos: ', connectedBlockPos);
				if ( ! this.bounds.left || connectedBlockX < this.bounds.left) {
					this.bounds.left = connectedBlockX;
				}
				if ( ! this.bounds.right || connectedBlockX + connectedBlockW > this.bounds.right) {
					this.bounds.right = connectedBlockX + connectedBlockW;
				}
				if ( ! this.bounds.top || connectedBlockY < this.bounds.top) {
					this.bounds.top = connectedBlockY;
				}
				if ( ! this.bounds.bottom || connectedBlockY + connectedBlockH > this.bounds.bottom) {
					this.bounds.bottom = connectedBlockY + connectedBlockH;
				}
				this.assemble(connectedBlock, connectedBlockPos, depth);
			}
		}

	}


	render(scale = 1)
	{
		if ( ! this.blocks.length) { return; }

		let html = '';

		log('this.bounds =', this.bounds);

		const bounds_offset_x = this.bounds.left - this.position.x;
		const bounds_offset_y = this.bounds.top - this.position.y;

		for (let i = 0; i < this.blocks.length; i++)
		{
			const block = this.blocks[i];
			const imageProp = block.getPropByType('image');
			const blockX = block.position.x - bounds_offset_x;
			const blockY = block.position.y - bounds_offset_y;
			const blockClass = 'block';

			let blockWidth = 0;
			let blockHeight = 0;
			let blockLayer = '';
			let blockImageSrc = 'img/noimage.png';

			log('block.type:', block.type, ', block.position =', block.position);

			if (imageProp)
			{
				blockWidth = parseInt(imageProp.value.w);
				blockHeight = parseInt(imageProp.value.h);
				blockLayer = 'z-index: ' + imageProp.value.z + ';'
				blockImageSrc = 'img/' + imageProp.name + '.png';
			}
			else
			{
				blockWidth = parseInt(block.getProp('blockWidth', 3));
				blockHeight = parseInt(block.getProp('blockHeight', 3));
			}

			html += '<div class="' + blockClass + '" style="'
				+ 'left:'   + Math.floor((blockX - 2) * scale) + 'px;'
				+ 'top:'    + Math.floor((blockY - 2) * scale) + 'px;'
				+ 'width:'  + Math.floor(blockWidth   * scale) + 'px;'
				+ 'height:' + Math.floor(blockHeight  * scale) + 'px;'
				+ blockLayer + '"><img src="' + blockImageSrc + '"></div>';
		}

		return html;
	}

}