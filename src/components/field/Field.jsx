import React, { useEffect} from "react";
import './Field.css';
import Cell from '../cell/Cell'


const Field = ({setSmiley, start, setStart, mask, setMask, field, myMask, size, bomb, setField}) => {

  const dimension = Array(size).fill(0);

  function youWin() {
    if(field.every((cell, i) => ((cell===bomb && mask[i] === myMask[2].flag) || (cell!==bomb && (mask[i] === myMask[0].base || mask[i] === myMask[1].transparent))))){
      setSmiley('cool')
      setStart(false)
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
                return (
                  <Cell 
                    x={x} 
                    y={y}
                    key={y*size + x}
                    setSmiley={setSmiley}
                    setField={setField}
                    start={start}
                    setStart={setStart}
                    field={field}
                    mask={mask}
                    setMask={setMask}
                    myMask={myMask}
                    size={size}
                    bomb={bomb}
                  />
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