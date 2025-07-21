// src/components/SuniaMascot.jsx

import { useState, useEffect } from 'react';
import { Lightbulb, AlertTriangle, Zap, Wind, Sun, Power } from 'lucide-react';

const messages = [
    { type: 'aviso', icon: <Sun size={18} className="text-yellow-400 flex-shrink-0" />, text: "Hoy se prevé buen clima, ¡buena producción solar!" },
    { type: 'recomendacion', icon: <Lightbulb size={18} className="text-green-400 flex-shrink-0" />, text: "Aprovecha la producción para tareas de alta demanda." },
    { type: 'accion', icon: <Zap size={18} className="text-purple-400 flex-shrink-0" />, text: "Ventilación inteligente activada para optimizar temperatura." },
    { type: 'aviso', icon: <Wind size={18} className="text-blue-400 flex-shrink-0" />, text: "Baja producción eólica prevista para esta noche." },
];

export default function SuniaMascot() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [isMessageVisible, setIsMessageVisible] = useState(true);
    const [isOn, setIsOn] = useState(true);

    useEffect(() => {
        if (!isOn) return;
        const interval = setInterval(() => {
            setIsMessageVisible(false);
            setTimeout(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setIsMessageVisible(true);
            }, 500);
        }, 5000);
        return () => clearInterval(interval);
    }, [isOn]);

    const handleToggle = (e) => {
        e.preventDefault();
        setIsOn(!isOn);
    };

    const activeMessage = messages[currentMessageIndex];

    return (
        <>
            <style jsx global>{`
                @keyframes solar-flare-orange {
                    0%, 100% { box-shadow: 0 0 15px 5px rgba(251, 146, 60, 0.5); }
                    50% { box-shadow: 0 0 25px 10px rgba(249, 115, 22, 0.3); }
                }
                .sunia-aura-orange {
                    animation: solar-flare-orange 4s ease-in-out infinite;
                }
                @keyframes blink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95% { transform: scaleY(0.1); }
                }
                @keyframes scan {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }
                .sunia-eyes {
                    animation: scan 5s ease-in-out infinite;
                }
                .sunia-eye {
                    animation: blink 6s infinite;
                }
                @keyframes wind-gust-white {
                    0% { transform: translateX(-100px) skewX(-15deg); opacity: 0; }
                    20%, 80% { opacity: 0.7; }
                    100% { transform: translateX(100px) skewX(15deg); opacity: 0; }
                }
                .wind-gust-white-element {
                    position: absolute;
                    width: 60px;
                    height: 2px;
                    background: white;
                    border-radius: 99px;
                    animation: wind-gust-white 3s ease-in-out infinite;
                    animation-delay: var(--delay);
                }
            `}</style>

            <div className={`fixed bottom-5 right-5 z-50 flex items-end gap-3 transition-opacity duration-500 ${!isOn ? 'opacity-50' : 'opacity-100'}`}>
                <a href={isOn ? "/sunia" : "#"} onClick={isOn ? undefined : handleToggle} className={`transition-all duration-500 ease-in-out ${isMessageVisible && isOn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-lg shadow-lg max-w-xs border border-slate-700 hover:border-orange-500 transition-colors">
                        <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-0.5">{activeMessage.icon}</div>
                            <p className="text-sm text-slate-200">{activeMessage.text}</p>
                        </div>
                    </div>
                </a>

                <div className="relative w-20 h-20 group">
                    <button onClick={handleToggle} title={isOn ? "Apagar SUNIA" : "Activar SUNIA"} className="w-full h-full">
                        <div className="relative w-20 h-20 transition-transform duration-300 ease-in-out group-hover:scale-110">
                            <div className={`absolute inset-0 rounded-full sunia-aura-orange transition-opacity duration-500 ${!isOn ? 'opacity-0' : 'opacity-100'}`}></div>
                            
                            {isOn && (
                                <div className="absolute inset-0 overflow-hidden rounded-full">
                                    <div className="wind-gust-white-element" style={{ top: '40%', '--delay': '0s' }}></div>
                                    <div className="wind-gust-white-element" style={{ top: '55%', '--delay': '1.5s', width: '40px', opacity: '0.5' }}></div>
                                </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-20 h-20">
                                    <g>
                                        <circle cx="12" cy="12" r="10" className="fill-slate-800/90 stroke-slate-700 group-hover:stroke-orange-400 transition-colors" strokeWidth="1" />
                                        <g className={`transition-opacity duration-500 ${isOn ? 'opacity-100' : 'opacity-20'}`}>
                                            
                                            {/* Grupo de Ojos Animados */}
                                            <g className="sunia-eyes">
                                                {/* Ojo izquierdo (con parpadeo) - CORREGIDO */}
                                                <ellipse cx="9" cy="11" rx="1.5" ry="2" className="fill-orange-400 sunia-eye" style={{ animationDelay: '0.3s' }}/>
                                                {/* Ojo derecho (con parpadeo) - CORREGIDO */}
                                                <ellipse cx="15" cy="11" rx="1.5" ry="2" className="fill-orange-400 sunia-eye"/>
                                            </g>
                                            
                                            {/* Boca */}
                                            <path d="M9 15.5 Q 12 17 15 15.5" stroke="#fb923c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                             
                            {!isOn && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-full">
                                    <Power size={32} className="text-red-500" />
                                </div>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}
