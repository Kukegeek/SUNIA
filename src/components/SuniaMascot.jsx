// src/components/SuniaMascot.jsx

import { useState, useEffect } from 'react';
import { Lightbulb, AlertTriangle, Zap, Wind, Sun } from 'lucide-react';

// Lista de mensajes que rotarán
const messages = [
    { type: 'aviso', icon: <Sun size={18} className="text-yellow-400 flex-shrink-0" />, text: "Hoy se prevé buen clima, ¡buena producción solar!" },
    { type: 'recomendacion', icon: <Lightbulb size={18} className="text-green-400 flex-shrink-0" />, text: "Aprovecha la producción para tareas de alta demanda." },
    { type: 'accion', icon: <Zap size={18} className="text-purple-400 flex-shrink-0" />, text: "Ventilación inteligente activada para optimizar temperatura." },
    { type: 'aviso', icon: <Wind size={18} className="text-blue-400 flex-shrink-0" />, text: "Baja producción eólica prevista para esta noche." },
];

// Usamos 'export default' porque es un componente de React
export default function SuniaMascot() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false); // Inicia la animación de salida
            
            setTimeout(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
                setIsVisible(true); // Inicia la animación de entrada
            }, 500); // Duración de la animación de salida

        }, 5000); // Cambia el mensaje cada 5 segundos

        return () => clearInterval(interval);
    }, []);

    const activeMessage = messages[currentMessageIndex];

    return (
        // --- CORRECCIÓN: 'class' se reemplaza por 'className' en todo el JSX ---
        <div className="fixed bottom-5 right-5 z-50 flex items-end gap-3">
            
            {/* Burbuja de notificación */}
            <div className={`transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="bg-slate-800/80 backdrop-blur-md p-3 rounded-lg shadow-lg max-w-xs border border-slate-700">
                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">{activeMessage.icon}</div>
                        <p className="text-sm text-slate-200">{activeMessage.text}</p>
                    </div>
                </div>
            </div>

            {/* Mascota */}
            <a href="/sunia" className="group" title="Ir al panel de SUNIA">
                <div className="relative w-16 h-16 transition-transform duration-300 ease-in-out group-hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-teal-400 rounded-full blur-md opacity-60 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse"></div>
                    <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-slate-700 group-hover:border-teal-400 transition-colors duration-300">
                        <Lightbulb className="w-8 h-8 text-yellow-300" />
                    </div>
                </div>
            </a>
        </div>
    );
}