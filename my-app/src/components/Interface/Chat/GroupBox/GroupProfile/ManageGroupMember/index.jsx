import React, { useCallback, useState, useEffect } from 'react';
import axios from "axios";
import './styles.css';

import DeleteIcon from'@mui/icons-material/Delete';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Toolbar, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFullGroupInfo } from '../../../../../../reduxActions/fullGroupInfoActions';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';



function MembersItem({_id, name, profilePictureURL, dispatchFullGroupInfo, isCreator}){

  const removeMembers=function(){
    if(isCreator){
      axios.post('/api/removeGroupMembers', {'memberId': _id})
      .then(()=>{
        alert("成功删除");
        dispatchFullGroupInfo();
      }).catch(()=>{
        alert("出现了点问题...");
      });
    };
  };

  return(
    <ListItem
    className='manage-group-contact'
    style={{'width': 'auto'}}
    secondaryAction={
      isCreator ? (
        <IconButton edge='end' aria-label='delete' onClick={removeMembers}>
          <DeleteIcon />
        </IconButton>
      ) : null
    }>
      <ListItemAvatar>
        <Avatar
          alt={'profile photo of '+name}
          src={profilePictureURL}
        />
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItem>
  );
};


function ManageGroupMembers({isCreator}){
  const fullGroupMembers = useSelector(state => state.fullGroupInfo.item.groupMembers);
  const fullGroupStatus=useSelector(state=>state.fullGroupInfo.status);

  const [isSort, setIsSort]=useState(false);
  const [orderedMembers, setOrderedMembers]=useState([]);
  const [usingMembers, setUsingMembers]=useState([]);

  const [isLoading, setIsLoading]=useState(true);


  const dispatch = useDispatch();
  const dispatchFullGroupInfo = useCallback(() => {
    dispatch(fetchFullGroupInfo());
  }, [dispatch]);


  function sortMembers(obj) {
    const sortedKeys = Object.keys(obj).sort((a, b) => {
        return obj[a].name.localeCompare(obj[b].name, 'en', {numeric: true});
    });

    const sortedObj = {};
    for (const key of sortedKeys) {
        sortedObj[key] = obj[key];
    }

    setOrderedMembers(sortedObj);

  }


  useEffect(()=>{
    if(fullGroupStatus==='succeeded'){
      setUsingMembers(fullGroupMembers);
      sortMembers(fullGroupMembers);
      setIsLoading(false);
    };
  }, [fullGroupStatus, fullGroupMembers]);


  // 处理排序状态的变化
  useEffect(() => {
    if (isSort) {
      setUsingMembers(orderedMembers);
    } else {
      setUsingMembers(fullGroupMembers);
    }
  }, [isSort, fullGroupMembers, orderedMembers]);


  const changeSort=()=>{
    setIsSort(!isSort);
  }
  
  if(isLoading){
    return <CircularProgress />
  }

  
  return(
    <div>
      <Toolbar className="group-member-toolbar">
        <Typography>按字母排序</Typography>
        <IconButton aria-label="sort" onClick={changeSort}>
          <SortByAlphaIcon />
        </IconButton>
      </Toolbar>
      <List component="nav" className="manage-group-contacts">
        {
          Object.keys(usingMembers).map(memberId=>{
            const member=usingMembers[memberId];
            return <MembersItem 
                    key={memberId} 
                    _id={memberId} 
                    name={member.name} 
                    profilePictureURL={member.profilePictureURL} 
                    dispatchFullGroupInfo={dispatchFullGroupInfo} 
                    isCreator={isCreator} />
          })
        }
      </List>
    </div>
  );
};


export default ManageGroupMembers;