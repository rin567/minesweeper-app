import React from "react";
import './styles/Smiley.css'


const Smiley = ({smiley,setSmiley,...props}) => {



  return (
      <div {...props} className={"smiley "+ smiley}></div>
  )
}

export default Smiley;