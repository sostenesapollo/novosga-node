import { useSignalEffect } from "@preact/signals-react";
import { env } from "@/root";
import { connect, socket } from './index';
import { soundNotification } from "@/components/generic/sound-notification";
import { notify } from "@/components/generic/snackbar";
import { ticket } from "../dashboard.painel";
import { ticketsList } from "../dashboard.painel";
import { useSignals } from "@preact/signals-react/runtime";
import { useEffect } from "react";
import { log } from "console";

export function SocketEvents() {
  useSignals();

  useSignalEffect(() => {
    if (env.value?.SOCKET_IO_SERVER === "" || env.value?.SERVER_URL === "") return;

    socket.value = connect();

    if (!socket) return;

    socket.value?.on("message", (data) => {
      if (data.type === 'info') {
        notify.info(data.message);
      }
    });

    socket.value?.on("call-ticket", (data) => {
      console.log('Fala ticket', window.location.pathname, data);
      if (window.location.pathname !== '/dashboard/painel') return;
      console.log('Fala senha', data  );
      ticket.value = data;
    });

    socket.value?.on("new-tickets-available", (data) => {
      console.log('new-tickets-available', data);
      ticketsList.value = data;
    });

    return () => {
      socket.value?.close();
    };
  });


  useEffect(() => {
    const handleSpeak = (text) => {
      console.log('speech', text, window.speechSynthesis);

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

    soundNotification.value?.play('success')

    if (window.location.pathname !== '/dashboard/painel') return;
    

    if (ticket.value) {
      console.log(`Senha ${ticket.value.priority} ${ticket.value.number} guichê ${ticket.value.desk}`);
      handleSpeak(`Senha ${ticket.value.priority} ${ticket.value.number} guichê ${ticket.value.desk}`);
    }
    return ()=>{
      soundNotification.value?.play('success')
    }
  }, [ticket.value]);
}
