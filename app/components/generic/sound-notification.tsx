import { useEffect, useRef } from "react";
import { signal } from '@preact/signals-react';

export const soundNotification = signal(null);
export default function SoundNotification({play=()=>{}}) {
    const audioPlayer1 = useRef(null) as any;
    const audioPlayer2 = useRef(null) as any;
    const audioPlayer3 = useRef(null) as any;

    function playNotification(tone = "/confetti.mp3") {
        if (tone === "pop") {
            audioPlayer2.muted = true;
            audioPlayer2.current.currentTime = 0;
            audioPlayer2?.current?.play();
        } else if (tone === "success") {
            audioPlayer3.muted = true;
            audioPlayer3.current.currentTime = 0;
            audioPlayer3?.current?.play();
        } else {
            audioPlayer1.muted = true;
            audioPlayer1.current.currentTime = 0;
            audioPlayer1?.current?.play();
        }
    }

    useEffect(()=>{
        soundNotification.value = {play: playNotification};
    })

    return (
        <div>
            {/* Notify */}
            <audio ref={audioPlayer1} src={"/confetti.mp3"} />
            <audio ref={audioPlayer2} src={"/tone.mp3"} />
            <audio ref={audioPlayer3} src={"/tone-2.mp3"} />
        </div>
    )
}