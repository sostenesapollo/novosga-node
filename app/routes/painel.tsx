import React, { useState, useEffect } from 'react';
import { useSignals } from "@preact/signals-react/runtime";
import '../tailwind.css'
import { socket, SocketEvents } from './components/socket-events';

const TextToSpeech = () => {
  const [text, setText] = useState('');

  const handleSpeak = (text) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.5;
  
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const lucianaVoice = voices.find(voice => 
          voice.lang === 'pt-BR' && voice.name === 'Luciana'
        );
  
        if (lucianaVoice) {
          utterance.voice = lucianaVoice;
        } else {
          console.error('Luciana voice not found.');
        }
  
        window.speechSynthesis.speak(utterance);
      };
  
      // Ensure voices are loaded before attempting to speak
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoice();
        };
      }
    } else {
      console.error('Speech Synthesis API is not supported in this browser.');
    }
  };  

  const [ticket, setTicket] = useState({
    number: 'A123',
    priority: 'Normal',
    desk: '1'
  })

  useSignals()
  SocketEvents()


  useEffect(()=>{
    socket.value?.on("call-next", (ticket) => {
      console.log('chama e fala', ticket);
      setTicket(ticket)
      speak()
    })
  },[])
    
  const speak = () => handleSpeak(`Senha ${ticket.number} guichê ${ticket.desk}`)

  return (
    <div className="flex h-screen justify-center items-center bg-blue-400">
      <div className="text-center "> 
          <h1 className="text-3xl">Senha {ticket.priority}</h1>
          <h1 className="text-[200px]">{ticket.number}</h1>
          <h1 className="text-[50px]">Guichê {ticket.desk}</h1>
      </div>
      <button onClick={speak}>call</button>
    </div>
  );
};

export default TextToSpeech;
