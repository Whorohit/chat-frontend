import { FileOpen } from '@mui/icons-material'
import React from 'react'

const Renderattachment = ({file, url}) => {
 
    
 switch (file) {
    case "video":

        return <video src={url} preload='none' width={"200px"} controls />
        
    case "image":
       return  <img src={url} height={"150px"} style={{
            objectFit: "contain"
        }} width={"200px"} />
      
    case "audio":
        return <audio src={url} preload="none" controls />
      

    default:
        return  <FileOpen  />
  
}
}
export default Renderattachment;