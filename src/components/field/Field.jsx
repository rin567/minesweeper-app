import React, { useEffect, useState} from "react";
import './Field.css';

const Field = ({setSmiley, start, setStart}) => {

	// Объявление констант
  const myMask = [{base: 'Base'}, {transparent: 'null'}, {flag: 'Flag'}, {question: 'Question'}];
  const size = 16;
  const bomb = -1;

  // Создание поля
  function createField(size) {
    const myField = Array(size*size).fill(0);

    function inc(x, y) {
      if(x >= 0 && x < size && y >= 0 && y < size) {
        if(myField[y * size + x] === bomb) return;
        myField[y * size + x] += 1;
      }
    }
    // Распределение бомб, i = количество бомб
    for(let i=0; i< size*2;) {
      const x = Math.floor(Math.random()*size);
      const y = Math.floor(Math.random()*size);

      if(myField[y * size + x] === bomb) continue;

      myField[y * size + x] = bomb;
      i++;

      inc(x+1, y);
      inc(x-1, y);
      inc(x, y+1);
      inc(x, y-1);
      inc(x+1, y-1);
      inc(x-1, y-1);
      inc(x+1, y+1);
      inc(x-1, y+1);
    }
    return myField
  }

	const [field, setField] = useState(() => createField(size));
  const [mask, setMask] = useState(() => Array(size*size).fill(myMask[0].base))

	useEffect(() => {
		if(start){
			setField(() => createField(size));
    	setMask(() => Array(size*size).fill(myMask[0].base));
		}
	}, [start])

  const dimension = Array(size).fill(0);

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
			setStart(0);
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
	function onDoubleClick(x, y) {
		if((mask[y*size + x] === myMask[0].base) || (field[y*size + x] === 0)) return
		const arr = []
		let countFlag = 0
		function pushArr(x, y) {
			if(x >= 0 && x < size && y >= 0 && y < size){
				if(mask[y*size + x] === myMask[2].flag) {
					countFlag++
					return
				}
				arr.push([x, y])
			}
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
	
	function onContextMenu(x, y) {
    if(!start) return
		
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

	function onMouseUp(x, y) {
		if(mask[y*size + x] === myMask[1].transparent) return
		if(!start) return
		setSmiley('happy')
	}

	function onMouseDown(e, x, y) {
		if(mask[y*size + x] === myMask[1].transparent) return
		if(!start) return
		if(e.button === 0) {
			setSmiley('wow')
		}
	}

	function onClick(x, y) {
		if(!start) return
		if(mask[y*size + x] === myMask[1].transparent) return
		if(mask.every((m) => m === myMask[0].base)) {
			firstClick(x, y)
		}
		clear(x, y)
		isBomb(x, y)
		setMask((prev) => [...prev])
	}

  function youWin() {
    if(field.every((cell, i) => ((cell===bomb && mask[i] === myMask[2].flag) || (cell!==bomb && (mask[i] === myMask[0].base || mask[i] === myMask[1].transparent))))){
      setSmiley('cool')
      setStart(0)
    }
  }
  useEffect(() => {
    youWin()
  }, [mask])

  return (
    <div>
      { dimension.map((_,y) => {
         return (
           <div key={y} style={{display: 'flex'}}>
             { dimension.map((_,x) => {
                let numCell = field[y*size + x];

                if(mask[y*size + x] !== myMask[1].transparent) {
                  numCell = mask[y*size + x];
                }
                return (
                  <div
                    key = {y*size + x}
                    className={'cell cell'+ numCell}
                    onMouseDown = {(e) => onMouseDown(e, x, y)}
                    onMouseUp = {() => onMouseUp(x, y)}
                    onClick = {() => onClick(x, y)}
                    onDoubleClick = {() => onDoubleClick(x, y)}
                    onContextMenu = {(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onContextMenu(x, y)
                      }
                    }
                  >
                  </div>
                )
               })
             }
           </div>
         )
       })

      }
    </div>
  )
}

export default Field;