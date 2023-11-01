import { ListItem, ListItemText, Checkbox, Dialog, DialogTitle, DialogContent, ListItemAvatar, Avatar, List, TextField, DialogActions, Button, CircularProgress  } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';

function ListButton({_id, username, profilePictureURL, handleChecks }) {
  const contactId=_id;


  return (
    <ListItem
      key={contactId}
      secondaryAction={
      <Checkbox
        edge="end"
        onChange={()=>handleChecks(contactId)}
        inputProps={{ 'aria-labelledby': contactId }}
        />
      }
    >
      <ListItemAvatar>
        <Avatar
          alt={'profile photo of '+username}
          src={profilePictureURL}
        />
      </ListItemAvatar>
      <ListItemText primary={username} />
    </ListItem>
  )
}


function CreateGroup({ isOpen, setIsOpen }){
  const [groupName, setGroupName]=useState('');
  const [groupMemberIds, setGroupMemberIds]=useState([]);

  const fullContact=useSelector(state=>state.fullContact.item);
  const fullContactState=useSelector(state=>state.fullContact.status);

  // 当子组件触发复选框的时候调用该函数。使用钩子是确保组件不会为每个子组件创建一个函数
  const handleChecks=useCallback((personId)=>{
    const newGroupIds = [...groupMemberIds];
    const index=newGroupIds.indexOf(personId)
    if(index===-1){
      newGroupIds.push(personId);
    } else {
      newGroupIds.splice(index, 1);
    }
    setGroupMemberIds(newGroupIds);
  }, [groupMemberIds]);


  const handleClose=()=> setIsOpen(false);

  const handleSubmit=()=>{
    if(groupName.trim().length===0) {
      alert("组名不能为空");
      return;
    }
    axios.post('/api/createNewGroup', {
      groupName: groupName,
      groupMemberIds: groupMemberIds
    }).then(()=>{
      alert("成功创建群组！");
      handleClose();
    }).catch(err=>{
      alert("创建失败！");
      console.log(err);
    });
    console.log(groupName);
    console.log(groupMemberIds);
  }

  if(fullContactState!=='succeeded')
    return (<CircularProgress />)

  return(
    <div>
      <Dialog
      open={isOpen} 
      aria-labelledby="alert-dialog-title" 
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle>输入群组名称</DialogTitle>
        <DialogContent>
          <TextField
            value={groupName} 
            onChange={e=>{setGroupName(e.target.value)}}
            label='Group Name'
          />
        </DialogContent>

        <DialogTitle>选择要添加的联系人</DialogTitle>
        <DialogContent>
          <List component="nav" className="nav-list-group">
              {fullContact.map((item)=>{
                return <ListButton key={item._id} {...item} handleChecks={handleChecks} className="nav-list-item-group" />
              })}
            </List>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            创建
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CreateGroup;