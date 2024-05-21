import React, { useState, useEffect } from 'react';
import { useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { socket } from '../dashboard';
import { Button } from '@/components/ui/button';
import { ticket, ticketsList } from '../dashboard.painel';

const AtendimentoGuiche = () => {
  useSignals()

  const callNext = () => {
    console.log('call-next', socket.value);
    socket.value?.emit('call-next', { });
  }

  const callAgain = () => {
    console.log('call-again', socket.value);
    socket.value?.emit('call-again', { });
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-blue-400">
      <span className='flex flex-col space-y-3'>
        Senha da vez: {ticket.value?.number} - {ticket.value?.priority} 
        <Button variant="outline" className='p-5 text-3xl' onClick={callAgain}>
          <span className='px-4'>
          Chamar senha da vez
          </span>
        </Button>
        <Button variant="outline" className='p-5 text-3xl' onClick={callNext}>
          <span className='px-4'>
          Chamar próxima senha
          </span>
        </Button>
      </span>
      
      <span className='pt-5 flex flex-col'>
        {ticketsList.value?.tickets?.length > 0 ? 
          <ProximasSenhas senhas={ticketsList.value?.tickets}/> :
          <span className='text-2xl'>
            Nenhuma senha para ser chamada no momento
          </span>
        }
      </span>
    </div>
  );
};

export const ProximasSenhas = ({senhas}) => {
  return (
    <span className='space-x-2 pt-3'>
      {senhas?.slice(0,10)?.map((senha, index)=>(
        <span key={index} className='bg-green-300 text-4xl p-2 '>
        <>
          {senha.number}
        </>
        <span className='bg-green-300 text-xs p-2'>
          {senha?.priority}
        </span>
        </span>
      ))}
    </span>
  )
}

export default AtendimentoGuiche;