import React, { useState, useEffect } from 'react';
import { useSignals } from "@preact/signals-react/runtime";
import '../tailwind.css'
import { socket, SocketEvents } from './components/socket-events';

const TextToSpeech = () => {

  const ticket = {
    number: 'A123',
    priority: 'Normal',
    desk: '1'
  }

  useSignals()
  SocketEvents()


  socket.value?.on("call-next", (data) => {
    console.log('n');
    
    handleSpeak(`Senha ${ticket.number} guichê ${ticket.desk}`)
  })


  const generateTicket = (priority) => {
    socket.value?.emit('generate-ticket', { priority });
  }

  return (
    <div className="flex h-screen justify-center items-center bg-blue-400">
      <div className="text-center "> 
          <button onClick={()=>generateTicket('Normal')}>Senha convencional</button>
          <button onClick={()=>generateTicket('Prioridade')}>Senha prioridade</button>
      </div>
    </div>
  );
};

export default TextToSpeech;
