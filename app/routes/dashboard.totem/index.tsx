import React, { useState, useEffect } from 'react';
import { useSignals } from "@preact/signals-react/runtime";
import { socket } from '../dashboard';
import { Button } from "../../components/ui/button";
import { notify } from '@/components/generic/snackbar';

const Totem = () => {

  const generateTicket = (priority) => {
    notify.info('Imprimindo...')
    socket.value?.emit('generate-ticket', { priority });
  }

  return (
    <div className="flex h-screen justify-center items-center bg-blue-400">
      <div className="text-center space-x-2"> 
          <Button variant="outline" className='p-5 text-3xl' onClick={()=>generateTicket('Normal')}>
            <span className='px-4'>
            Senha convencional
            </span>
          </Button>
          <Button variant="outline" className='p-5 text-3xl' onClick={()=>generateTicket('Prioridade')}>
            <span className='px-4'>
            Senha Prioridade
            </span>
          </Button>
          
      </div>
    </div>
  );
};

export default Totem;