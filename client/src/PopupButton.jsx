import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { VideoCallOutlined } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
    header: { 
      backgroundColor: '	#303030',
      textAlign: "left",
      padding: "10px",
      position: "fixed",
      left: "0",
      top: "0",
      height: "30px",
      width: "80%",
      },
    }));
   
const ModalButton = props => {
    const classes = useStyles();
    const [isPopupOn, setIsPopupOn] = useState(false);
    
    return ( 
    <div className={ classes.header }>

    {/* If Chat Popup is On then show highlighted button else show black button */}

    {isPopupOn ?(
          <Button 
          style={{backgroundColor: '#696969', bottom:'5px', borderRadius: '60%', color: '#FFFFFF', height:'40px', width:'10px'}} 
          startIcon={<VideoCallOutlined 
          style={{fontSize:25, height:'30px', width:'40px'}}/>} 
          onClick={() => {setIsPopupOn(!isPopupOn); 
            props.handleClick()}} >
              {props.children}
          </Button>
          ):(
          <Button 
          style={{backgroundColor: '#000000', bottom:'5px', borderRadius: '60%', color: '#FFFFFF',  height:'40px', width:'10px', shape: 'circle'}} 
          startIcon={<VideoCallOutlined style={{fontSize:25, height:'30px', width:'40px'}}/>} 
          onClick={() => {setIsPopupOn(!isPopupOn); props.handleClick()}} 
          >{props.children}
          </Button>
          )}
    
    </div>
    );
    };
export default ModalButton;