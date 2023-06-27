import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDXj596E2JiHOkkO-JC0_uyonEhEL8OsvI",
    authDomain: "soundwaves-87a97.firebaseapp.com",
    projectId: "soundwaves-87a97",
    storageBucket: "soundwaves-87a97.appspot.com",
    messagingSenderId: "678572354071",
    appId: "1:678572354071:web:b4d797a1bde8d3ebd78a52"
  };

  const navigate = useNavigate()

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the Firebase Storage service
  const storage = firebase.storage();
  const storageRef = storage.ref()
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const canSubmit = username && imageFile && audioFile;
const handleUsernameChange = (event) => {
  setUsername(event.target.value);
};

const handleImageChange = (event) => {
  setImageFile(event.target.files[0]);
};

const handleAudioChange = (event) => {
  setAudioFile(event.target.files[0]);
};

const generateUniqueFileName = (file) => {
  const uniqueName = Date.now() + '-' + file.name;
  return uniqueName;
};

const handleSubmit = (event) => {
  event.preventDefault();
  if (canSubmit) {
    savedata.disabled = true;
    savedata.innerText = "Uploading..."

    // Generate unique filenames for image and audio files
    const uniqueImageName = generateUniqueFileName(imageFile);  //adding  
    const uniqueAudioName = generateUniqueFileName(audioFile);

    // Upload the image and audio files to Firebase Storage
    const imageRef = storageRef.child(uniqueImageName);
    const audioRef = storageRef.child(uniqueAudioName);

    const imageUploadTask = imageRef.put(imageFile);
    const audioUploadTask = audioRef.put(audioFile);

    Promise.all([imageUploadTask, audioUploadTask])
      .then(() => {
        // Get the download URLs for the uploaded files
        imageRef.getDownloadURL().then((imageDownloadURL) => {
          audioRef.getDownloadURL().then((audioDownloadURL) => {
            // Send the data to your server
            const data = {
              username: username,
              imageDownloadURL: imageDownloadURL,
              audioDownloadURL: audioDownloadURL,
            };
            savedata.innerText = "Upload"

            if (data) {
              sendtoserver(data)
            }
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    alert("Please fill all the fields!")
  }
};

  // const link = "https://drab-tan-gharial-ring.cyclic.app"
  const link="http://localhost:4000"


  function sendtoserver(data) {
    fetch(`${link}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the response from your server
        console.log(responseData);
        navigate("/")
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', minHeight: '70vh' }}>
        <h1 className='text-xl text-red-500 font-bold text-center '>Upload Your Image and Audio Here*</h1>
        <form onSubmit={handleSubmit} className='container mt-12 max-w-md mx-auto bg-white p-4 rounded shadow'>
          <div className='mb-4'>
            <label htmlFor='username' className='block text-gray-700 font-bold mb-2'>
              Song Name:
            </label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={handleUsernameChange}
              className='w-full border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='image' className='block text-gray-700 font-bold mb-2'>
              Image:
            </label>
            <input
              type='file'
              id='image'
              accept='image/*'
              onChange={handleImageChange}
              className='border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='audio' className='block text-gray-700 font-bold mb-2'>
              Audio:
            </label>
            <input
              type='file'
              id='audio'
              accept='audio/*'
              onChange={handleAudioChange}
              className='border border-gray-300 rounded px-3 py-2'
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            id="savedata"
            className={`py-2 px-4 rounded ${!canSubmit ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-700'
              } text-white font-bold`}
          >            Upload
          </button>
        </form>
      </motion.div>
      <center>
        <Link style={{ position: "absolute", bottom: 0, left: 0 }} className="text-bold text-2xl bg-blue-500 w-full font-bold py-2" to="/">Go Back</Link>
      </center>
    </>
  );
};

export default Register;
