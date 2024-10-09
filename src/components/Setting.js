import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, TimePicker, DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const Setting = ({ modalOpen, setModalOpen }) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState(dayjs()); // Start with today's date
  const [time, setTime] = useState(dayjs().startOf('minute')); // Start with current time
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');

  const handleDobChange = (newValue) => {
    setDob(newValue);
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSelectGender = (gender) => {
    setSelectedGender(gender);
    setShowDropdown(false); // Close the dropdown after selection
  };

  const getCoordinates = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: address,
          format: 'json',
        },
      });
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setLocation({ latitude: lat, longitude: lon });
      } else {
        alert("Address Not Found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveKey = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validate required fields
    if (!name || !dob || !time || !address || !selectedGender) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const obj = {
      name,
      dob,
      time,
      location,
      address,
      gender: selectedGender,
    };
    localStorage.setItem("profile", JSON.stringify(obj));
    setModalOpen(false);
    window.location.reload();
  };

  return (
    <form onSubmit={saveKey} className="flex flex-col items-center justify-center gap-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">User Details</h2>

      <div className="w-full max-w-xs">
        <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
        <input
          required
          value={name}
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-full max-w-xs">
        <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              value={dob}
              onChange={handleDobChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <div className="w-full max-w-xs">
        <label className="block mb-2 text-sm font-medium text-gray-700">Time</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['TimePicker']}>
            <TimePicker
              value={time}
              onChange={handleTimeChange}
              renderInput={(params) => <TextField {...params} />}
              ampm={false} // 24-hour format
              format="HH:mm:ss"
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <div className="w-full max-w-xs">
        <label className="block mb-2 text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter an address"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={getCoordinates}
          className="mt-2 bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
        >
          Get Coordinates
        </button>
        {location.latitude && location.longitude && (
          <div className="mt-2 text-sm text-gray-600">
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </div>
        )}
      </div>

      <div className="relative w-full max-w-xs">
        <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
        <button
          type="button"
          onClick={handleToggleDropdown}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 text-left"
        >
          {selectedGender || 'Select Gender'}
        </button>
        {showDropdown && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
            {['Male', 'Female', 'Other'].map((gender) => (
              <li
                key={gender}
                onClick={() => handleSelectGender(gender)}
                className="cursor-pointer p-2 hover:bg-gray-200"
              >
                {gender}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="btn bg-blue-500 text-white border-none w-full max-w-xs hover:bg-blue-600 p-2 rounded-lg"
      >
        Next
      </button>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
    </form>
  );
};

export default Setting;
