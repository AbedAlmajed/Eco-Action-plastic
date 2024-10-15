"use client"

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Search, Star, Recycle, Trash2, Wind, ArrowLeft, ArrowRight } from 'lucide-react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [challengesPerPage] = useState(6);
  const [animationDirection, setAnimationDirection] = useState(1);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/challenges');
        if (!response.ok) throw new Error('Failed to fetch challenges');
        const data = await response.json();
        setChallenges(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastChallenge = currentPage * challengesPerPage;
  const indexOfFirstChallenge = indexOfLastChallenge - challengesPerPage;
  const currentChallenges = filteredChallenges.slice(indexOfFirstChallenge, indexOfLastChallenge);
  const totalPages = Math.ceil(filteredChallenges.length / challengesPerPage);
  const token = Cookies.get('token');

  const handleChallengeClick = (challengeId, isDisabled) => {
    if (isDisabled) return;

    const isAuthorized = !token;
    if (isAuthorized) {
      window.location.href = `/challenges/${challengeId}`;
    } else {
      Swal.fire({
        title: 'You need to log in!',
        text: 'Please log in to access this feature.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Go to Login',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) window.location.href = '/login';
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    setAnimationDirection(pageNumber > currentPage ? 1 : -1);
    setCurrentPage(pageNumber);
  };

  const getImpactIcon = (impactType) => {
    switch (impactType.toLowerCase()) {
      // case 'water': return <Water className="w-4 h-4 mr-1" />;
      case 'air': return <Wind className="w-4 h-4 mr-1" />;
      case 'waste': return <Trash2 className="w-4 h-4 mr-1" />;
      default: return <Recycle className="w-4 h-4 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Recycle className="w-16 h-16 text-green" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 m-4 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <header className=" text-blue py-12 px-4 sm:px-6 lg:px-8  pt-24">
        <motion.h1
          className="text-5xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Re Plastify Challenges
        </motion.h1>
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center  border-2  border-blue  bg-white rounded-md shadow-md overflow-hidden">
            <Search className="w-6 h-6 text-green ml-4" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-4 focus:outline-none text-gray-800 text-lg"
            />
          </div>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.section
            key={currentPage}
            initial={{ opacity: 0, x: animationDirection * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: animationDirection * -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentChallenges.map((challenge, index) => {
                const isCompletedOrApproved = challenge.isDisabled;

                return (
                  <motion.div
                    key={challenge._id}
                    className={`overflow-hidden shadow-lg rounded-2xl transition-all duration-300 
                      ${isCompletedOrApproved ? 'bg-gray-200 opacity-70 cursor-not-allowed' : 'bg-white hover:shadow-2xl cursor-pointer'}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: isCompletedOrApproved ? 1 : 1.05 }}
                    onClick={() => {
                      if (!isCompletedOrApproved) {
                        handleChallengeClick(challenge._id, challenge.isDisabled);
                      }
                    }}
                  >
                    <div className="relative pb-48">
                      <img
                        className="absolute h-full w-full object-cover"
                        src={challenge.image}
                        alt={challenge.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    </div>
                    <div className="p-6">
                      <h3 className={`text-2xl font-bold mb-2 ${isCompletedOrApproved ? 'text-gray-600' : 'text-green'} line-clamp-2`}>
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{challenge.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="flex items-center text-yellow-500 font-semibold">
                          <Star className="w-5 h-5 mr-1" />
                          {challenge.points} Points
                        </span>
                        <span className="flex items-center text-sm px-3 py-1 bg-green-100 text-green rounded-full">
                          {getImpactIcon(challenge.impactType)}
                          {challenge.impactType}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </AnimatePresence>

        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mx-2 bg-green text-white px-6 py-3 rounded-md disabled:opacity-50 transition-colors duration-300 hover:bg-blueD flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
          </motion.button>
          <span className="mx-2 flex items-center text-gray-700 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="mx-2 bg-green text-white px-6 py-3 rounded-md disabled:opacity-50 transition-colors duration-300 hover:bg-blueD flex items-center"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default ChallengeList;