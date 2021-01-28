import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import { EditorState, convertToRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "draft-js-mention-plugin";
import "draft-js/dist/Draft.css";
import { Link } from "react-router-dom";
import { fetchUserMentions, fetchHashtagMentions } from "../../store/mentions";
import { uploadPost } from "../../store/posts";

import './MessagePage.css'


function MessagePage() {

  const [currentMsg, setCurrentMsg] = useState('');

  const msgClick = e => {
    e.preventDefault();
    setCurrentMsg('');
  }
  return (
    <div className='message-page-main-div'>
      <div className='message-page-left-panel'>
        <div className='top-left-div'></div>
        <div className='middle-left-div'></div>
        <div className='main-left-div'>
          <div>User1</div>
          <div>User2</div>
          <div>User3</div>
        </div>
      </div>
      <div className='message-page-right-panel'>
        <div className='top-right-div'></div>
        <div className='main-right-div'>
          <div className='message-pannel-div'>
            <div className='messages-div'>
              message div
            </div>
            <div className='message-typing-box-div'>
              <form className='message-input-form'>
                <input 
                  type='text'
                  className='message-input-box'
                  value={currentMsg}
                  onChange={e => setCurrentMsg(e.target.value)}
                />
                {/* <textarea className='message-input-box'></textarea> */}
                <button type='submit' onClick={msgClick}>Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagePage;