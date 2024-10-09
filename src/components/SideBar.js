import React, { useState, useContext, useEffect, useCallback } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { CgProfile } from "react-icons/cg";
import { ChatContext } from '../context/chatContext';
import Modal from './Modal';
import Setting from './Setting';
import { IoChatbubble } from "react-icons/io5";
import dayjs from 'dayjs';

/**
 * A sidebar component that displays a list of nav items and a toggle
 * for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 */
const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [, , clearMessages] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(() => JSON.parse(localStorage.getItem("profile")));

  // Fetch profile data from local storage
  const fetchProfileData = () => {
    const data = JSON.parse(localStorage.getItem("profile"));
    setProfileData(data);
  };

  const dateOfBirth = profileData?.dob?.slice(0, 10);
  const formattedTime = profileData?.time ? dayjs(profileData.time).format('HH:mm:ss') : ''; // Format time

  // Clear profile data from local storage
  const handleClear = useCallback(() => {
    localStorage.removeItem("profile");
    window.location.reload();
    setProfileData(null); // Update state immediately
  }, []);

 // const clearChat = () => clearMessages();

  // Effect to fetch profile data on mount and listen to storage changes
  useEffect(() => {
    fetchProfileData();

    const handleStorageChange = (event) => {
      if (event.key === "profile") {
        fetchProfileData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Only run on mount and when fetchProfileData changes

  return (
    <section className={`${open ? 'w-screen lg:w-80' : 'w-16'} sidebar`}>
      <div className="sidebar__app-bar">
        <div className="flex items-center">
          <div className={`sidebar__app-logo ${!open && 'scale-0 hidden'}`}>
            <span className="w-8 h-8">
              <IoChatbubble className='text-black w-10 h-10 m-3' />
            </span>
          </div>
          <h1 className={`sidebar__app-title ${!open && 'scale-0 hidden'}`}>CHAT</h1>
        </div>
        <div className={'sidebar__btn-close'} onClick={() => setOpen(!open)}>
          {open ? (
            <MdChevronLeft className="text-slate-700 sidebar__btn-icon" />
          ) : (
            <MdChevronRight className="text-slate-700 sidebar__btn-icon" />
          )}
        </div>
      </div>

      <div className="nav__bottom">
        <div onClick={() => setModalOpen(true)} className="nav">
          <span htmlFor="setting-modal" className="nav__item">
            <div className="nav__icons">
              <CgProfile style={{ width: "30px", height: "30px" }} />
            </div>
            <h1 className={`${!open && 'hidden'} font-bold`}>Profile</h1>
          </span>     
        </div>
      </div>

      <Modal title={profileData ? "Profile" : "Details"} modalOpen={modalOpen} setModalOpen={setModalOpen}>
        {profileData ? (
          <div>
            <button type='button' onClick={() => handleClear()} className='w-auto h-auto bg-blue-600 p-2 m-2 rounded-lg text-white'>Clear</button>
            <div className='flex flex-row gap-2 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
              <div>
                <h1 className='text-xl font-bold text-gray-800'>Name</h1>
                <h1 className='text-xl font-bold text-gray-800'>DOB</h1>
                <h1 className='text-xl font-bold text-gray-800'>Time</h1>
                <h1 className='text-xl font-bold text-gray-800'>Latitude</h1>
                <h1 className='text-xl font-bold text-gray-800'>Longitude</h1>
                <h1 className='text-xl font-bold text-gray-800'>Gender</h1>
                <h1 className='text-xl font-bold text-gray-800'>Place</h1>
              </div>
              <div className='flex flex-col font-bold text-xl'>
                <span className='font-normal text-green-500 ml-3'>: {profileData.name.toUpperCase()}</span>
                <span className='font-normal text-green-500 ml-3'>: {dateOfBirth}</span>
                <span className='font-normal text-green-500 ml-3'>: {formattedTime}</span> {/* Use formatted time */}
                <span className='font-normal text-green-500 ml-3'>: {profileData.location.latitude}</span>
                <span className='font-normal text-green-500 ml-3'>: {profileData.location.longitude}</span>
                <span className='font-normal text-green-500 ml-3'>: {profileData.gender.toUpperCase()}</span>
                <span className='font-normal text-green-500 ml-3'>: {profileData.address.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ) : (
          <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
        )}
      </Modal>
    </section>
  );
};

export default SideBar;
