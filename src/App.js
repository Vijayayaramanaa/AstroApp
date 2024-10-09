import React, { useCallback } from 'react';
import { ChatContextProvider } from './context/chatContext';
import SideBar from './components/SideBar';
import ChatView from './components/ChatView';
import { useEffect, useState } from 'react';
import Modal from './components/Modal';
import Setting from './components/Setting';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data,setData] = useState(false)
  const [check,setCheck] = useState(null)


  useEffect(() => {
   const apiKey = window.localStorage.getItem('api-key');
   if (!apiKey) {
     setModalOpen(true);
    }
 }, []);
  const fetchProfileData = useCallback(()=>{
    const getData = JSON.parse(localStorage.getItem("profile"))
    if(getData){
      setData(true)
      setCheck(getData)
    }else{
      setCheck(null)
      setData(false)
    }
  },[])
  useEffect(()=>{
      fetchProfileData()
  },[])
  return (
    <ChatContextProvider >
      <div>
      { data ? null:
      <Modal title="Provide Details" modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
      }
    </div>
      <div className="flex transition duration-500 ease-in-out">
        <SideBar />
        <ChatView />
      </div>
    </ChatContextProvider>
  );
};

export default App;
