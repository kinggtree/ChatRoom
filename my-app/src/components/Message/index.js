import React from 'react';
import './Message.css';

const Message = ({contactName, messageText, isUserMessage, timestamp})=>{

    // 可以在这里添加更多的逻辑，比如格式化时间戳。

    const messageClass=isUserMessage?'user-message':'contact-message'

    return(
        <div className={'message ${messageClass}'}>
            <p>{contactName}: {messageText}</p>
            <span className='timestamp'>{new Date(timestamp).toLocaleString()}</span>
        </div>
    )
}

// 需要对话框页面利用propTypes实现props验证

// 传递参数可以使用bind方法或者是e合成事件方法
// <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
// <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>


export default Message;