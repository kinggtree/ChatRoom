import React, { useCallback, useState } from 'react';
import axios from "axios";

import DeleteIcon from'@mui/icons-material/Delete';
import { Divider, IconButton, List, ListItem, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFullGroupInfo } from '../../../../../../reduxActions/fullGroupInfoActions';
import AddNotice from './AddNotice';


function NoticeItem({_id, content, dispatchFullGroupInfo, isCreator}){

  const removeNotice=function(){
    if(isCreator){
      axios.post('/api/removeGroupNotice', {'noticeId': _id})
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
      style={{ padding: '10px 0' }} 
      secondaryAction={
        isCreator ? (
          <IconButton edge='end' aria-label='delete' onClick={removeNotice}>
            <DeleteIcon />
          </IconButton>
        ) : null
      }>
        <ListItemText primary={content} />
      </ListItem>
      <Divider />
    </div>

  );
};



function ManageNotice(){
  const groupNotice = useSelector(state => state.fullGroupInfo.item.groupNotice);
  const groupOwnerId=useSelector(state=>state.fullGroupInfo.item.groupOwnerId);
  const userId=useSelector(state=>state.userInfo.item._id);

  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);

  const openAddNotice = () => {
    setIsAddNoticeOpen(true);
    handleClose();
  };


  const dispatch = useDispatch();
  const dispatchFullGroupInfo = useCallback(() => {
    dispatch(fetchFullGroupInfo());
  }, [dispatch]);

  
  return(
    <div>
      <Button onClick={openAddNotice}></Button>
      <AddNotice isOpen={isAddNoticeOpen} setIsOpen={setIsAddNoticeOpen} dispatchFullGroupInfo={dispatchFullGroupInfo} />
      <List component="nav" className="contacts">
        {
          groupNotice.map(notice=>{
            return <NoticeItem 
                    key={notice._id} 
                    _id={notice._id} 
                    content={notice.content}
                    dispatchFullGroupInfo={dispatchFullGroupInfo} 
                    isCreator={groupOwnerId===userId ? true : false} />
          })
        }
      </List>
    </div>
  );
};


export default ManageNotice;