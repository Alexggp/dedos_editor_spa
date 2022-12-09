import React, {useEffect, useRef, useState, useCallback} from 'react';
import { useDispatch, useSelector } from "react-redux";

import ResizableAndDraggable from '../../../hoc/ResizableAndDraggable/ResizableAndDraggable';
import classes from './Token.module.css';
import { updateToken, deleteToken } from '../../../../store/actions/tokens';
import { updateArea } from '../../../../store/actions/areas';
import Options from './Options/Options';

import { activitiesActions } from '../../../../store/reducers/activities';


const Token = (props) => {
  const activityList = useSelector(state => state.activities.activityList);
  const areaList = useSelector((state) => state.areas.areaList);
  const currentActivityId = useSelector((state) => state.activities.currentActivityId);
  const [showOptions, setShowOptions] = useState(false);

  const activity = activityList.find(ac => ac._id === currentActivityId);
  const [zIndex, setZIndex] = useState(1);

  const tokenRef = useRef();
  const dispatch = useDispatch();

  const updateZIndex = () => {
    const auxActivity = {...activity}
    auxActivity.zIndexTop = auxActivity.zIndexTop + 1;
    dispatch(activitiesActions.update(auxActivity));

    if(props.area){
      const auxArea = {...props.area}
      auxArea.zIndex = auxActivity.zIndexTop;
      dispatch(updateArea(auxArea))
    }


    // +1000 to be always over the areas
    setZIndex(activity.zIndexTop+1000);
  }

  useEffect(()=>{
    // This functin is only triggered the first time the token is rendered
    // Calling hasMoved to check overlaping and calculate offsets
    hasMoved(props.token.offset);
    if (props.token.zIndex){
      setZIndex(props.token.zIndex);
    }else{
      updateZIndex();
    }
    // eslint-disable-next-line
  },[])

  const checkAreaOverlapping = useCallback((obj) =>{
    
    // Checks if the token overlaps with any area
  
    const areas = areaList.filter(ar => ar.activityId === currentActivityId);
    let overlapsWith = 0;
    areas.forEach(area => {

      // area.top > obj.bottom ||
      // area.right < obj.left ||
      // area.bottom < obj.top ||
      // area.left > obj.right
  
      const overlaps = !(
        area.offset.y > (obj.screenOffset.y + obj.size.h) ||
        (area.offset.x + area.size.w) < obj.screenOffset.x ||
        (area.offset.y + area.size.h) < obj.screenOffset.y ||
        area.offset.x > (obj.screenOffset.x + obj.size.w)
      );
      if (overlaps) overlapsWith = area._id;
      
    });
    return overlapsWith;
  },[areaList, currentActivityId])


  useEffect(()=>{

      // eslint-disable-next-line
  },[])

  const stopPropagation = (e) =>{
    e.stopPropagation();
  }

  const calculateNewOffset = (token) =>{
    const area = areaList.find(ar => ar._id === token.areaId);
    return {
      x: token.screenOffset.x - area.offset.x + 3,
      y: token.screenOffset.y - area.offset.y + 3
    }
  }

  const optionsButtonHandler = (e) =>{
    setShowOptions(!showOptions);
  }

  const hasMoved = ({x, y})=>{
    const auxToken = {...props.token}
    
    // Getting the offset referenced by the Edition Area div
    auxToken.screenOffset={
      x: tokenRef.current.getBoundingClientRect().x - 229,
      y: tokenRef.current.getBoundingClientRect().y - 84
    }
    
    // Checking if a token is dropped within an area
    auxToken.areaId = checkAreaOverlapping(auxToken);

    // Getting the offset referenced by the parent
    if (!auxToken.areaId){
      // If the token is outside any area, offset = screenOffset
      auxToken.offset = auxToken.screenOffset;
    }
    else if (auxToken.areaId !== props.token.areaId){
      // if the parent area changes, calculates a new offset 
      auxToken.offset = calculateNewOffset(auxToken);
    } else {
      // The token has been moved inside the same area
      auxToken.offset = {x: x, y: y};
    }
    auxToken.zIndex = zIndex;


    dispatch(updateToken(auxToken));
  }
  const hasResized = ({w, h})=>{
    const auxToken = {...props.token}
    // Size is returned as a string with px. eg: {w: '10px', y: '30px'}
    // It must be normalized as a number
    auxToken.size = {
      w: Number(w.replace('px','')), 
      h: Number(h.replace('px',''))
    };
    dispatch(updateToken(auxToken));
  }
  
  const deleteTokenHandler = ()=>{
    dispatch(deleteToken(props.token._id));
  }

  const pinButtonHandler = (e) =>{
    const auxToken = {...props.token}
    auxToken.movable = !props.token.movable;
    dispatch(updateToken(auxToken));
  }

  const updateOptions = (token) => {
    dispatch(updateToken(token));
  }


  let pinButtonClass = classes.PinButton;

  if (!props.token.movable) {
    pinButtonClass = classes.PinButtonPressed;
  }
  
  const tokenClasses = [classes.Token, classes[`Token_type_${props.type}`]].join(' ');

  const headerContent = !showOptions ? (
    <React.Fragment>
      <div className={pinButtonClass} onMouseDown={stopPropagation} onClick={pinButtonHandler}></div>
      {props.title} 
      {props.addButton}
    </React.Fragment>
   
  ) : '';

  const optionsContainer = showOptions ? (
    <Options token={props.token} updateOptions={updateOptions}/>
  ) : '';

  return(

      <ResizableAndDraggable
        dragHandleClassName={classes.Header}
        offset={props.token.offset}
        moved = {hasMoved}
        resized = {hasResized}
        delete = {deleteTokenHandler}
        zIndex = {zIndex}
        updateZIndex = {updateZIndex}
        notMove={!props.token.movable}
        size={props.token.size}>
          <div className={tokenClasses}  ref={tokenRef}>
            <div className={classes.Header} >
              {headerContent}
            </div>
            <div className={classes.Body} >
              <div className={classes.OptionsButton} onClick={optionsButtonHandler}></div>
              {props.children}
              {optionsContainer}
            </div>
          </div>
      </ResizableAndDraggable>
  )

}

export default Token;