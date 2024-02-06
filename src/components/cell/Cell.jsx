import './Cell.css'

const Cell = ({x,y,setSmiley, start, setStart, mask, 	setMask, field, setField, myMask, size, bomb}) => {
	
	let numCell = field[y*size + x];

	if(mask[y*size + x] !== myMask[1].transparent) {
		numCell = mask[y*size + x];
	}

	function firstClick(x, y) {
    let countBomb = 0;

    function dec(x, y) {
      if(x >= 0 && x < size && y >= 0 && y < size) {
        if(field[y * size + x] === bomb) {
          countBomb++
          return
        };
        field[y * size + x] -= 1;
      }
      return countBomb
    }

    if(field[y*size + x]===bomb){
      dec(x+1, y);
      dec(x-1, y);
      dec(x, y+1);
      dec(x, y-1);
      dec(x+1, y-1);
      dec(x-1, y-1);
      dec(x+1, y+1);
      dec(x-1, y+1);
      field[y*size + x] = countBomb;
    }

    setField((prev) => [...prev])
  }

	function clear(x, y) {
		const clearing = [];

		function pushClearing(x, y) {
			if(x >= 0 && x < size && y >= 0 && y < size) {
				if(mask[y*size + x] === myMask[1].transparent) return
				clearing.push([x, y]);
			}
		}

		pushClearing(x, y);
		
		while (clearing.length) {
			const [x, y] = clearing.pop();

			mask[y*size + x] = myMask[1].transparent;

			if(field[y*size + x] !== 0) continue;

			pushClearing(x+1, y);
			pushClearing(x-1, y);
			pushClearing(x, y+1);
			pushClearing(x, y-1);
		}
	}

	function isBomb(x, y) {
		if(field[y*size + x]===bomb) {
			setStart(false);
			field[y*size + x]='RedBomb';
			setSmiley('loser');
			field.forEach((cell, i) => {
				if(cell === bomb) {
					if(mask[i] === myMask[2].flag) {
						field[i] = 'CrossBomb';
					} 
					mask[i] = myMask[1].transparent;
				}
			})
		}
	}
	//Обработчики событий
	function onDoubleClick() {
		if((mask[y*size + x] === myMask[0].base) || (field[y*size + x] === 0)) return
		const arr = []
		let countFlag = 0
		function pushArr(x, y) {
			if(mask[y*size + x] === myMask[2].flag) {
				countFlag++
				return
			}
			arr.push([x, y])
		}
		pushArr(x+1, y);
		pushArr(x-1, y);
		pushArr(x, y+1);
		pushArr(x, y-1);
		pushArr(x+1, y-1);
		pushArr(x-1, y-1);
		pushArr(x+1, y+1);
		pushArr(x-1, y+1);
		if (countFlag === field[y*size + x] ) {
			while (arr.length){
				const [x, y] = arr.pop()
				clear(x, y)
				if(field[y*size + x]===bomb) isBomb(x, y)
			}
		}
	}
	
	function onContextMenu() {
    if(start === false) return
		
		switch(mask[y*size + x]) {
			case myMask[0].base:
				mask[y*size + x] = myMask[2].flag;
				break;
			case myMask[2].flag:
				mask[y*size + x] = myMask[3].question;
				break;
			case myMask[3].question:
				mask[y*size + x] = myMask[0].base;
				break;
			default:
				return
		}
    setMask((prev) => [...prev])
  }

	function onMouseUp() {
		if(mask[y*size + x] === myMask[1].transparent) return
		if(start === false) return
		setSmiley('happy')
	}

	function onMouseDown(e) {
		if(mask[y*size + x] === myMask[1].transparent) return
		if(start === false) return
		if(e.button === 0) {
			setSmiley('wow')
		}
	}

	function onClick() {
		if(start === false) return
		if(mask[y*size + x] === myMask[1].transparent) return
		if(mask.every((m) => m === myMask[0].base)) {
			firstClick(x, y)
		}
		clear(x, y)
		isBomb(x, y)
		setMask((prev) => [...prev])
	}

	return (
		<div key={x}
			className={'cell cell'+ numCell}
			onMouseDown = {(e) => onMouseDown(e)}
			onMouseUp = {onMouseUp}
			onClick = {onClick}
			onDoubleClick = {onDoubleClick}
			onContextMenu = {(e) => {
				e.preventDefault()
				e.stopPropagation()
				onContextMenu()
				}
			}
		>
		</div>
	)
}
export default Cell