import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const SolarAIMascot = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Recomendaciones inteligentes basadas en energía solar
  const solarTips = [
    "💡 ¡Hola! Soy SUNIA, tu asistente de energía solar. ¿Sabías que hoy es un gran día para consumir energía?",
    "☀️ Tip: Los paneles solares son más eficientes en días despejados como hoy. ¡Aprovecha al máximo!",
    "🔋 Ayer ahorraste un 78% de tu consumo electrico, hoy puedes batir tu record, ¡sigue así!",
    "🌱 Cada kWh solar que generas evita 0.26kg de CO2. ¡Estás ayudando al planeta!",
    "📊 Revisa tus recomendaciones para optimizar tu consumo energético.",
    "🏠 Tip: Usa electrodomésticos durante las horas de mayor radiación solar (10-17h), conseguiras ¡¡Solaris Extra!!.",
    "⚡ Tu instalación esta generando menor energia de lo esperado, ¡Haz clic en mí para ir a SUNIA!"
  ];

  // Cambiar tip cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % solarTips.length);
        setIsAnimating(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Mostrar tooltip al pasar el mouse
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.location.href = '/sunia';
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
      {/* Tooltip de recomendación */}
      <div 
        className={`
          bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
          text-white p-3 rounded-lg shadow-lg max-w-xs 
          transform transition-all duration-500 ease-in-out
          ${isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}
          ${showTooltip ? 'animate-bounce' : ''}
        `}
      >
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium leading-relaxed pr-2">
            {solarTips[currentTip]}
          </p>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Flecha del tooltip */}
        <div className="absolute bottom-[-8px] right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-orange-500"></div>
      </div>

      {/* Mascota Solaris */}
      <div 
        onClick={handleClick}
        className="
          relative cursor-pointer transform transition-all duration-300 
          hover:scale-110 hover:rotate-12 active:scale-95
          animate-pulse hover:animate-none
        "
      >
        {/* Aura de energía */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-60 animate-ping"></div>
        
        {/* Cuerpo principal de Solaris */}
        <div className="
          relative w-16 h-16 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 
          rounded-full shadow-lg border-2 border-yellow-200
          flex items-center justify-center overflow-hidden
        ">
          {/* Cara de la IA */}
          <div className="relative z-10">
            {/* Ojos */}
            <div className="flex space-x-2 mb-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            {/* Sonrisa */}
            <div className="w-4 h-2 border-b-2 border-white rounded-full"></div>
          </div>
          
          {/* Rayos de sol animados */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-yellow-200 opacity-70"
                style={{
                  top: '2px',
                  left: '50%',
                  transformOrigin: '50% 30px',
                  transform: `rotate(${i * 45}deg) translateX(-50%)`,
                  animation: `spin 4s linear infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          {/* Partículas de energía */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-bounce"
                style={{
                  top: `${20 + Math.random() * 40}%`,
                  left: `${20 + Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Indicador de clic */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
          <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SolarAIMascot;