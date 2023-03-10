import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import dedosInstance from '../../apis/dedosInstance';

import classes from './FileLoader.module.css';


export default function FileLoaer({ containerId, activityId, projectId, onLoad }) {

  const [loading, setLoading] = useState(false)

  const loadImage = async (file) => {
    if (!file) {
      return;
    }
    setLoading(true);
    try {
      //Uploading the file 
      const config = {
        headers: {
          'content-type': file.type
        }
      };
      const formData = new FormData()
      formData.append('file', file); 
      formData.append('containerId', containerId);
      formData.append('activityId', activityId);
      formData.append('projectId', projectId);
      const response = await dedosInstance.post(`/files`, formData, config);
      if (response.status !== 200) {
        throw new Error(`Unexpected API call response with status: ${response.status} - ${response.statusText}`);
      } else {
        onLoad(response.data.url);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const onChangeHandler = (e) => {
    if (e.target.files) {
      loadImage(e.target.files[0]);
    }
  }

  return (
    <div className={classes.FileLoaer}>
      <input type="file" id={`file_${containerId}`} style={{ display: "none" }} accept="image/png, image/gif, image/jpeg" onChange={onChangeHandler} />
      <label htmlFor={`file_${containerId}`} onMouseDown={e => e.stopPropagation()}>
        {loading ? <CircularProgress size={30} sx={{ color: 'white.500' }} /> : <div className={classes.InputButton}></div>}
      </label>
    </div>
  );
}