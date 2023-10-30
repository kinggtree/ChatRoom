import React, { useCallback, useState } from 'react';
import axios from "axios";

import './styles.css';

import DeleteIcon from'@mui/icons-material/Delete';
import { IconButton, List, ListItem, ListItemText, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFullGroupInfo } from '../../../../../../reduxActions/fullGroupInfoActions';
import AddNotice from './AddNotice';


function NoticeItem({_id, groupId, content, dispatchFullGroupInfo, isCreator}){

  const removeNotice=function(){
    if(isCreator){
      axios.post('/api/removeGroupNotice', {'noticeId': _id, 'groupId': groupId})
      .then(()=>{
        alert("成功删除");
        dispatchFullGroupInfo();
      }).catch(()=>{
        alert("出现了点问题...");
      });
    };
  };

  return(
    <div>
      <ListItem
      className='group-notice'
      style={{'width': 'auto'}}
      secondaryAction={
        isCreator ? (
          <IconButton edge='end' aria-label='delete' onClick={removeNotice}>
            <DeleteIcon />
          </IconButton>
        ) : null
      }>
        <ListItemText primary={content} />
      </ListItem>
    </div>

  );
};



function ManageNotice({isCreator}){
  const groupNotice = useSelector(state => state.fullGroupInfo.item.groupNotice);
  const groupId=useSelector(state=>state.fullGroupInfo.item._id);

  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);

  const openAddNotice = () => {
    setIsAddNoticeOpen(true);
  };


  const dispatch = useDispatch();
  const dispatchFullGroupInfo = useCallback(() => {
    dispatch(fetchFullGroupInfo());
  }, [dispatch]);

  
  return(
    <div className='group-notices clearfix'>
      <AddNotice groupId={groupId} isOpen={isAddNoticeOpen} setIsOpen={setIsAddNoticeOpen} dispatchFullGroupInfo={dispatchFullGroupInfo} />
      <List component="nav" className="contacts">
        {
          groupNotice.map(notice=>{
            return <NoticeItem 
                    key={notice._id} 
                    _id={notice._id} 
                    groupId={groupId} 
                    content={notice.content}
                    dispatchFullGroupInfo={dispatchFullGroupInfo} 
                    isCreator={isCreator} />
          })
        }
      </List>
      {isCreator ? (<Button onClick={openAddNotice} className='add-notice-button'>添加群通知</Button>) : null}
    </div>
  );
};


export default ManageNotice;