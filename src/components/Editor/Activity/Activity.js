import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classes from './Activity.module.css';
import Area from '../items/Area/Area';
import Image from '../items/Image/Image';
import Text from '../items/Text/Text';

import Droppable from '../../hoc/Droppable/Droppable';

import {createArea} from '../../../store/reducers/areas'; 
import {addNewToken} from '../../../store/reducers/tokens'; 
import { togleTrash } from '../../../store/reducers/trashIsActive';


const Activity = (props) => {
  const dispatch = useDispatch();

  const tokenList = useSelector(state => state.tokensReducer.tokenList);
  const areaList = useSelector(state => state.areasReducer.areaList);
  const currentActivityId = useSelector(state => state.activitiesReducer.currentActivityId);

  const addNewItem = (item, offset)=>{
    switch (item) {
      case 'AddArea':
        dispatch(createArea(currentActivityId, {
          x: offset.x-220,
          y: offset.y-20
        }));
        break;
      case 'AddText':
        dispatch(addNewToken('txt', currentActivityId, {
          x: offset.x-220,
          y: offset.y-20
        }));
        break;
      case 'AddImage':
        dispatch(addNewToken('img', currentActivityId, {
          x: offset.x-220,
          y: offset.y-20
        }));
        break;
      default:
        return;  
    }
  }

  const processTokens = (tokenList, area)=>tokenList.map((token)=>{
    switch (token.type) {
      case 'img':
        return <Image key={token.id} token={token} area={area}/>;
      case 'txt':
        return <Text key={token.id} token={token} area={area}/>;
      default:
        return <Text key={token.id} token={token} area={area}/>;
    }
  })

  // getting tokens without area
  const independentTokenList = tokenList.filter((tkn)=>tkn.activityId === currentActivityId && tkn.areaId === 0);
  const tokens = processTokens(independentTokenList, null);

  // getting areas and tokens within area
  const areasFiltered = areaList.filter((area)=>area.activityId === currentActivityId);
  const areas = areasFiltered.map((area)=>{
    // tokens that belongs to this area
    const areaTokenList = tokenList.filter((tkn)=>tkn.activityId === currentActivityId && tkn.areaId === area.id);
    return (
      <Area key={area.id} area={area} tokens={areaTokenList}>
        {processTokens(areaTokenList, area)}
      </Area>
    )
  
  })

  const disclaimer = (!tokens.length && !areas.length) ? (
    <div className={classes.WelcomeText}>
      <p>SOY EL ÁREA DE EDICIÓN:</p>
      <p>ARRASTRA SOBRE MI LOS ICONOS DE LA BARRA DE<br/>HERRAMIENTAS PARA CREAR UNA ACTIVIDAD</p>
    </div>
  ) : '';

  return(
    
      <div id="Activity" className={classes.Activity} onClick={addNewItem}>
        
        <Droppable 
          type="Activity"
          accept={['AddArea','AddText','AddImage']} 
          activityId = {currentActivityId}
          dropped={addNewItem}>
            {tokens}
            {areas}
            {disclaimer}
            <div className={classes.Trash}
              onMouseEnter={()=>{dispatch(togleTrash(true))}}
              onMouseLeave={()=>{dispatch(togleTrash(false))}}
            />
        </Droppable>
      </div>
    
  )

}


export default Activity;