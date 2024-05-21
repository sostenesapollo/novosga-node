import React, { useEffect } from 'react';
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { signal } from '@preact/signals-react';
import { ProximasSenhas } from '../dashboard.atendimento';

export const ticket = signal(null);
export const ticketsList = signal(null);

const TextToSpeech = () => {

  useSignals();

  // useSignalEffect(() => {
  //   if (!ticketsList.value || ticketsList.value.length === 0) return;

  //   const ticket = ticketsList.value[0];
  //   console.log('call next', ticket);
  //   // handleSpeak(`Senha ${ticket.priority} ${ticket.number} guichê ${ticket.desk}`);
  // });

  return (
    <div className="flex h-screen justify-center items-center bg-blue-400 flex flex-col">
      { ticket?.value ? 
        <div className="text-center "> 
          <h1 className="text-[100px] mb-0">Senha {ticket.value.priority}</h1>
          <h1 className="text-[400px]">{ticket.value.number}</h1>
          <h1 className="text-[50px]">Guichê {ticket.value.desk}</h1>
        </div>
        : 'Aguardando chamada...'}
      <div className='mt-3'>
        <p>Próximas senhas a serem chamadas:</p>
        <ul className='mt-4'>
          <ProximasSenhas senhas={ticketsList.value?.tickets}/>
        </ul>
      </div>
      <button onClick={()=>{handleSpeak(`Teste`)}}>
        teste
      </button>
    </div>
  );
};

export default TextToSpeech;
