import React, { useEffect} from "react";
import './Field.css';

const Field = ({setSmiley, start, setStart, mask, setMask, field, myMask, size, bomb, firstClick}) => {

  const dimension = Array(size).fill(0);

  function onContextMenu(x,y,e) {
   
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

  function youWin() {
    if(field.every((cell, i) => (cell===bomb && (mask[i] === myMask[2].flag || mask[i] === myMask[0].base)) || mask[i] === myMask[1].transparent)){
      setSmiley('cool')
      setStart(false)
    }
  }
  useEffect(() => {
    youWin()
  })

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
                  <div key={x}
                       className={'cell cell'+ numCell}
                       onMouseDown = {(e) => {
                          if(mask[y*size + x] === myMask[1].transparent) return
                          if(start === false) return
                          if(e.button === 0) {
                            setSmiley('wow')
                          }
                        }}
                       onMouseUp = {()=> {
                          if(mask[y*size + x] === myMask[1].transparent) return
                          if(start === false) return
                          setSmiley('happy')
                        }}
                       onClick={() => {
                        if(start === false) return
                        if(mask[y*size + x] === myMask[1].transparent) return

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

                          if(mask.every((m) => m === myMask[0].base)) {
                              firstClick(x, y)
                            }

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
                       }}
                       onContextMenu={(e) => 
                        { e.preventDefault()
                          e.stopPropagation()
                          onContextMenu(x,y,e)
                        }}
                  ></div>
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