import React from 'react'
import Message from '../message';
import './ChatBox.css';

class ChatBox extends React.Component {
    render(){
        return (
            <div>
                <h2>Chat with {this.props.contact.name}</h2>
            </div>
        )
    }
}