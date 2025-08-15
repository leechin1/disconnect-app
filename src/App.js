import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  // State to track if the timer is running
  const [isRunning, setIsRunning] = useState(false);
  // State for the status message displayed to the user
  const [statusMessage, setStatusMessage] = useState('Click "Start" to begin.');

  // useRef to hold the interval ID. This prevents issues with stale closures
  // and ensures we can always access the latest ID to clear the interval.
  const intervalRef = useRef(null);

  // Define the notification interval in milliseconds (15 minutes).
  const notificationInterval = 15 * 60 * 1000;
  // For testing purposes, you can use a shorter interval like 10 seconds:
  // const notificationInterval = 10 * 1000;

  /**
   * Shows a desktop notification with a custom title and body.
   * @param {string} title The title of the notification.
   * @param {string} body The body text of the notification.
   */
  const showNotification = (title, body) => {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.error("This browser does not support desktop notification");
      setStatusMessage("Notifications not supported by your browser.");
      return;
    }

    // Check if permission has been granted
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/logo.png', // A simple icon for the notification
      });
    } else if (Notification.permission !== 'denied') {
      // If permission is not 'denied', request it from the user
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, {
            body: body,
            icon: '/logo.png',
          });
        }
      });
    }
  };

  // Function to start the timer
  const handleStart = () => {
    // Request permission if it hasn't been granted yet
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Clear any existing interval to prevent duplicates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set the state to running and update the status message
    setIsRunning(true);
    setStatusMessage('Notifications are active. I will notify you every 15 minutes.');

    // Show a notification that the timer has started
    showNotification('Notification Timer Activated', 'The 15-minute timer has started.');

    // Set a new interval and store its ID in the ref
    intervalRef.current = setInterval(() => {
      showNotification('Time to take a break!', 'It has been 15 minutes since you started the timer.');
    }, notificationInterval);
  };

  // Function to stop the timer
  const handleStop = () => {
    // Clear the interval using the stored ID from the ref
    clearInterval(intervalRef.current);

    // Set the state to stopped and update the status message
    setIsRunning(false);
    setStatusMessage('Notifications stopped. Click "Start" to restart.');

    // Show a notification that the timer has stopped
    showNotification('Notification Timer Deactivated', 'The 15-minute timer has been stopped.');
  };

  // useEffect hook for component cleanup. This is crucial to prevent memory leaks.
  useEffect(() => {
    // The return function is called when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // The empty dependency array ensures this runs only on mount and unmount

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Notification Timer
        </h1>
        <p className="text-gray-600 mb-6">
          {statusMessage}
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`
              w-full px-6 py-3 rounded-lg font-semibold text-lg transition-all
              ${isRunning ? 'bg-green-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}
            `}
          >
            Start Notifications
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className={`
              w-full px-6 py-3 rounded-lg font-semibold text-lg transition-all
              ${!isRunning ? 'bg-red-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'}
            `}
          >
            Stop Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
