import {useEffect, useState} from "react";

export const shortcuts = [
    ['Atualização de caixa', (e: any) => e.key === "i" && (e.metaKey || e.ctrlKey), ['⌘', 'I'], ['Ctrl', 'I']],
    ['Buscar clientes', (e: any) => e.key === "j" && (e.metaKey || e.ctrlKey), ['⌘', 'J'], ['Ctrl', 'J']],
    ['Nova venda', (e: any) => e.key === "k" && (e.metaKey || e.ctrlKey), ['⌘', 'K'], ['Ctrl', 'K']],
]

export function KeybindingsHelper() {

    const [platform, setPlatform] = useState<'mac'| 'windows'>('mac');
    useEffect(()=>{
        if(!window.navigator.platform.includes('Mac')) {
            setPlatform('windows')
        }
    },[])
    return (
        <span>
            <p className="text-sm text-muted-foreground">
                Atalhos:
            </p>
            {shortcuts.map(([description,_, mac, windows]: any ,index: number)=>(
                <p className="text-sm text-muted-foreground pt-2" key={`keybindings-${index}`}>
                    <kbd
                        className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        {platform === 'mac' ?
                            mac.map((key, index2)=>(<span key={`keybindings-mac-${index2}`} className="text-xs">{key}</span>)) :
                            windows.map((key, index3)=>(<span key={`keybindings-win-${index3}`} className="text-xs">{key}</span>))
                        }
                    </kbd>
                    <span>
                        {description}
                    </span>
                </p>
            ))}
        </span>
    )
}