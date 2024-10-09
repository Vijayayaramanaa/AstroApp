import React, { useState, useRef, useEffect, useContext } from 'react';
import ChatMessage from './ChatMessage';
import { ChatContext } from '../context/chatContext';
import { MdSend } from 'react-icons/md';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Modal from './Modal';
import Setting from './Setting';
import axios from "axios";
import dayjs from 'dayjs';

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState('');
  const [loadingMessageId, setLoadingMessageId] = useState(null);
  const [messages, addMessage] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  const api = "https://swt6p22kkie7j6vculzufs3brm0vynks.lambda-url.us-east-1.on.aws/";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getcall = async (messageId, apiCallData) => {
    setLoadingMessageId(messageId); // Set loading for this message
    try {
      const response = await axios.post(api, apiCallData);
      const msg = response.data.response.message;
      updateMessage(msg ? msg : response.error, true, messageId);
   //   console.log(response.data.response)
    } catch (e) {
      updateMessage(`Oops ! ${e.message}`, true, messageId);
    } finally {
      setLoadingMessageId(null); // Reset loading state
    }
  };

  const updateMessage = (newValue, ai = false, messageId = null) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: messageId || id, // Use existing message ID if updating
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
    };
    addMessage(newMsg);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue) return;

    const cleanPrompt = formValue.trim();
    const newMsg = cleanPrompt;
    setFormValue('');

    const messageId = Date.now(); // Unique ID for the message
    updateMessage(newMsg, false, messageId); // Add user's message

    // Prepare the API call data
    const apiCallData = prepareApiCallData(cleanPrompt);
    getcall(messageId, apiCallData); // Make the API call
  };

  const prepareApiCallData = (inputText) => {
    const getData = JSON.parse(localStorage.getItem("profile"));
    if (getData) {
      const { name, dob, gender, location, time, address } = getData;
      const formattedTime = time ? dayjs(time).format('HH:mm:ss').split(":") : ['', '', ''];
      return {
        name,
        inputText,
        sessionId: "user1",
        gender,
        hour: formattedTime[0],
        minutes: formattedTime[1],
        seconds: formattedTime[2],
        longitude: location.longitude,
        lattitude: location.latitude,
        day: dob.slice(8, 10),
        month: dob.slice(5, 7),
        year: dob.slice(0, 4),
        place: address,
      };
    }
    return {};
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="chatview">
      <main className="flex-1 overflow-auto p-4 bg-gray-100 w-auto relative">
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={{ ...message }} />
            {loadingMessageId === message.id && (
              <div className="flex items-center justify-center mt-2">
              <div className="animate-ping rounded-full border-t-2 border-blue-500 h-6 w-6 mr-2"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
            )}
          </div>
        ))}
        <span ref={messagesEndRef} />
      </main>
      <form className="form" onSubmit={sendMessage}>
        <div className="flex items-stretch justify-between w-screen">
          <textarea
            ref={inputRef}
            className="chatview__textarea-message"
            rows={1}
            value={formValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                sendMessage(e);
              }
            }}
            onChange={(event) => setFormValue(event.target.value)}
            disabled={loadingMessageId !== null}
          />
          <div className="flex items-center">
            <button type="submit" className="chatview__btn-send" disabled={!formValue}>
              <MdSend size={30} />
            </button>
          </div>
        </div>
        <ReactTooltip
          anchorId="tooltip"
          place="top"
          variant="dark"
          content="Help me with this prompt!"
        />
      </form>
      <Modal title="Setting" modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
    </div>
  );
};

export default ChatView;
