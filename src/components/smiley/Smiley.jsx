import React from "react";
import './Smiley.css'

const Smiley = ({smiley,setSmiley,...props}) => {
  return (
      <div {...props} className={"smiley "+ smiley}></div>
  )
}

export default Smiley;