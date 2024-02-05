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

	function onContextMenu() {
    if(start === false) return
		if(mask[y*size + x] === myMask[1].transparent) return

    if(mask[y*size + x] === myMask[0].base){
      mask[y*size + x] = myMask[2].flag;
    } else if(mask[y*size + x] === myMask[2].flag) {
      mask[y*size + x] = myMask[3].question;
    } else if(mask[y*size + x] === myMask[3].question) {
      mask[y*size + x] = myMask[0].base;
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
		
		const clearing = [];

		function clear(x, y) {
			if(x >= 0 && x < size && y >= 0 && y < size) {
				if(mask[y*size + x] === myMask[1].transparent) return
				clearing.push([x, y]);
			}
		}

		clear(x, y);
		
		while (clearing.length) {
			const [x, y] = clearing.pop();

			mask[y*size + x] = myMask[1].transparent;

			if(field[y*size + x] !== 0) continue;

			clear(x+1, y);
			clear(x-1, y);
			clear(x, y+1);
			clear(x, y-1);
		}

		if(field[y*size + x]===bomb) {
			setStart(false);
			field[y*size + x]='RedBomb';
			setSmiley('loser');
			field.forEach((cell, i) => {
				if(cell === bomb) {
					if(mask[i] === myMask[2].flag) {
						field[i] = 'CrossBomb';
						mask[i] = myMask[1].transparent;
					} else {
						mask[i] = myMask[1].transparent;
					}
				}
			})
		}

		setMask((prev) => [...prev])
	}

	return (
		<div key={x}
			className={'cell cell'+ numCell}
			onMouseDown = {(e) => onMouseDown(e)}
			onMouseUp = {onMouseUp}
			onClick = {onClick}
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