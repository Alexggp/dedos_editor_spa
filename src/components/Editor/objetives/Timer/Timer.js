import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { updateObjetive } from '../../../../store/actions/objetives';
import classes from './Timer.module.css';
import clockIcon from '../../../../assets/icons/clockIcon.png';
import closeIcon from '../../../../assets/icons/removeIcon.png';
import Draggable from '../../../../hoc/Draggable/Draggable';
import Modal from '../../../../hoc/Modal/Modal';

const Timer = ({objetive}) =>{
  const dispatch = useDispatch();
  const { t } = useTranslation('global');
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState(objetive.value);

  const closeHandler = () => {
    dispatch(updateObjetive({
      objetiveId: objetive._id,
      data: {value: inputValue}
    }))
    setShowInput(false);
  }

  const changeInputHandler = (e) => {
    if (e.target.value > 0) setInputValue(e.target.value)
  }

  return (
    <div className={classes.Timer}>
      <Draggable type={'TimerObj'} id={objetive._id}>
        <img alt='' style={{ width: "100%", height: "auto"}} src={clockIcon}/>
      </Draggable>
      <div className={classes.Bubble} onClick={()=>setShowInput(true)}>
          {// eslint-disable-next-line
            objetive.value+'\´\´'
          }
      </div>
      <Modal open={showInput} close={closeHandler}>
        <img alt='' className={classes.CloseModal} src={closeIcon} onClick={closeHandler}/>
        <label htmlFor={'TimerInput'}> {t('objetives.timer')}:  </label>
        <input 
          type='number'
          name={'TimerInput'}
          onChange={changeInputHandler}
          value = {inputValue}/>
      </Modal>
    </div>
  )
}

export default Timer;