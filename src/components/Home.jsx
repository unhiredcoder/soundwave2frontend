import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { motion, AnimatePresence } from 'framer-motion';
import "../style/style.css"




const Home = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const firebaseConfig = {
    apiKey: "AIzaSyDXj596E2JiHOkkO-JC0_uyonEhEL8OsvI",
    authDomain: "soundwaves-87a97.firebaseapp.com",
    projectId: "soundwaves-87a97",
    storageBucket: "soundwaves-87a97.appspot.com",
    messagingSenderId: "678572354071",
    appId: "1:678572354071:web:b4d797a1bde8d3ebd78a52"
  };


  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the Firebase Storage service
  const storage = firebase.storage();

  // const link = "https://drab-tan-gharial-ring.cyclic.app"
  const link="http://localhost:4000"
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${link}/users`);
      if (!response.ok) {
        throw new Error('Error retrieving users.');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  console.log(users);

  const deleteUser = async (user) => {
    try {
      const deleteButton = document.getElementById(user._id);
        deleteButton.innerText = 'Deleting...';
        deleteButton.disabled = true;
      // Delete the user from the backend
      const response = await fetch(`${link}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (response.ok) {
        // Delete the image file from Firebase Storage
        await storage.refFromURL(user.imageURL).delete();
        // Delete the audio file from Firebase Storage
        await storage.refFromURL(user.audioURL).delete();
  
        console.log('User deleted successfully from both places!');
        fetchUsers();
        deleteButton.innerText = 'Deleted';
        // Perform additional actions or show a success message
      } else {
        console.log('Error deleting user:', response.status);
        // Show an error message or perform error handling
      }
    } catch (error) {
      console.log(`Error deleting user: ${error.message}`);
      // Show an error message or perform error handling
  
      if (deleteButton) {
        deleteButton.innerText = 'Delete';
        deleteButton.disabled = false;
      }
    }
  };
  



  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="search-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <input
            type="search"
            placeholder="Search by song name"
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {!filteredUsers.length > 0 ? (
          <div
            className='not-found'
          >Not Found ❌</div>
        ) : (
          filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              className="p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mycls bg-gray-100 p-6 rounded-lg">
                <img
                  className="h-40 rounded w-full object-contain object-center mb-6"
                  src={user.imageURL}
                  alt="content"
                />
                <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                  Added On Date: {user.date}
                </h3>
                <h2 className="text-l text-gray-900 font-small title-font my-2">{user.username}</h2>
                <div className="audio-container">
                  <audio controls className="responsive-audio">
                    <source src={user.audioURL} type="audio/mpeg" />
                  </audio>
                </div>
                <button
                  style={{ borderRadius: "10px" }}
                  id={user._id}
                  onClick={() => deleteUser(user)}
                  className="text-l bg-red-400 text-white pt-1 pb-1 pl-4 pr-4 my-2"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </>
  );
};
export default Home;