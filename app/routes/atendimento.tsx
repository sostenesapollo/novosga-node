import React, { useState, useEffect } from 'react';
import { useSignals } from "@preact/signals-react/runtime";
import '../tailwind.css'
import { socket, SocketEvents } from './components/socket-events';

const TextToSpeech = () => {
  useSignals()
  SocketEvents()

  const callNext = () => {
    console.log('call-next', socket.value);
    socket.value?.emit('call-next', { });
  }

  return (
    <div className="flex h-screen justify-center items-center bg-blue-400">
      <button onClick={callNext}>Chamar próxima senha</button>
    </div>
  );
};

export default TextToSpeech;
