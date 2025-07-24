// src/components/SuniaDashboard.jsx

import { useState } from 'react';
import { 
    AlertTriangle, Lightbulb, Zap, Thermometer, WashingMachine, Disc, Car, Plug, Power, Wifi, WifiOff, 
    CheckCircle, XCircle, AlertCircle, Home, Snowflake, Flame, Minus, Wind, Cpu, EyeOff, KeyRound, Gauge,
    PanelTop, PanelLeft, PanelRight, Heater, Droplets, Sun, Fan, HelpCircle
} from 'lucide-react';

// --- SUB-COMPONENTES AUXILIARES (con Tooltip y ayudas) ---

const Tooltip = ({ children, content, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };
    
    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && content && (
                <div className={`absolute z-50 ${positionClasses[position]} w-64`}>
                    <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-lg border border-slate-600">
                        <div className="flex items-start gap-2">
                            <HelpCircle size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>{content}</div>
                        </div>
                        <div className={`absolute w-2 h-2 bg-slate-900 border-slate-600 transform rotate-45 ${
                            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b' :
                            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t' :
                            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' :
                            'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'
                        }`}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InfoColumn = ({ title, icon, children, helpContent }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg">
        <Tooltip content={helpContent} position="bottom">
             <h3 className="text-lg font-bold mb-3 flex items-center cursor-help">{icon}{title}</h3>
        </Tooltip>
        <div className="space-y-3 text-sm">{children}</div>
    </div>
);

const InfoItem = ({ text, time, icon }) => (
    <div className="flex gap-3">
        <div className="flex-shrink-0 pt-1">{icon}</div>
        <div>
            <p className="text-slate-200">{text}</p>
            <p className="text-xs text-slate-400">{time}</p>
        </div>
    </div>
);

const DeviceCard = ({ device, onToggle, children, helpContent }) => (
    <Tooltip content={helpContent}>
        <div className={`bg-slate-800/50 p-4 rounded-lg flex flex-col gap-3 transition-all duration-300 hover:bg-slate-800/70 hover:scale-105 cursor-help ${!device.isOn ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {device.icon}
                    <h4 className="text-xl font-bold">{device.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                    {device.hasWifi ? <Wifi size={16} className="text-green-400"/> : <WifiOff size={16} className="text-red-400"/>}
                    { onToggle && (
                        <button onClick={onToggle}>
                            <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${device.isOn ? 'bg-green-500 justify-end' : 'bg-slate-700 justify-start'}`}>
                                <span className="w-5 h-5 bg-white rounded-full shadow-md transform mx-0.5"></span>
                            </div>
                        </button>
                    )}
                </div>
            </div>
            {device.description && <p className="text-sm text-slate-300">{device.description}</p>}
            {children}
        </div>
    </Tooltip>
);

const SensorCard = ({ title, icon, sensors, helpContent }) => (
    <Tooltip content={helpContent} position="top">
        <div className="bg-slate-800/50 p-4 rounded-lg cursor-help">
            <h3 className="text-lg font-bold mb-3 flex items-center">{icon}{title}</h3>
            <div className="space-y-2">
                {sensors.map(sensor => {
                    const colorClasses = { green: 'text-green-400', yellow: 'text-yellow-400', red: 'text-red-400', gray: 'text-slate-400' };
                    const StatusIcon = { green: CheckCircle, yellow: AlertCircle, red: XCircle, gray: Minus }[sensor.status];
                    return (
                        <div key={sensor.name} className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2 text-slate-300">{sensor.icon}{sensor.name}</span>
                            <span className={`flex items-center gap-1.5 font-semibold ${colorClasses[sensor.status]}`}><StatusIcon size={16}/>{sensor.value}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    </Tooltip>
);


// --- COMPONENTE PRINCIPAL ---
export default function SuniaDashboard() {
    // --- INICIO DE CAMBIOS EN EL ESTADO ---
    const [devices, setDevices] = useState({
        climatizacion: { 
            isOn: true, 
            modes: ['Eco', 'Turbo', 'Ventilación'], 
            activeMode: 'Eco',
            targetTemp: 21
        },
        lavadora: { 
            isOn: true, 
            modes: ['Eco', 'Delicada', 'Sucio'], 
            activeMode: 'Eco' 
        },
        lavavajillas: { 
            isOn: false, 
            modes: ['Eco', 'Sucio', 'Brillante'], 
            activeMode: 'Eco', 
            hasWifi: false 
        },
        iluminacion: { 
            isOn: true, 
            modes: ['Eco', 'Normal', 'Luminoso'], 
            activeMode: 'Eco'
        },
        cargaVehiculo: { isOn: true },
        caldera: { isOn: true, mode: 'Auto' },
        cortinasPosicion: { isOn: true },
        cortinasApertura: { isOn: true },
        v2h: { isOn: false },
    });

    const handleToggle = (deviceId) => { setDevices(prev => ({ ...prev, [deviceId]: { ...prev[deviceId], isOn: !prev[deviceId].isOn } })); };
    const handleModeChange = (deviceId, newMode) => { setDevices(prev => ({ ...prev, [deviceId]: { ...prev[deviceId], activeMode: newMode } })); };
    
    const handleTempChange = (deviceId, newTemp) => {
        setDevices(prev => ({
            ...prev,
            [deviceId]: {
                ...prev[deviceId],
                targetTemp: Number(newTemp)
            }
        }));
    };
    // --- FIN DE CAMBIOS EN EL ESTADO ---

    // Datos para la tarjeta de iluminación dinámica
    const iluminacionData = {
        Eco: { progresivo: '5-25%', presencia: '50%' },
        Normal: { progresivo: '5-35%', presencia: '60%' },
        Luminoso: { progresivo: '10-50%', presencia: '70%' }
    };
    const currentIluminacion = iluminacionData[devices.iluminacion.activeMode];
    
    const helpContent = {
        sections: {
            avisos: "Información relevante sobre el estado actual y predicciones a corto plazo, como el clima o la producción energética esperada.",
            recomendaciones: "Sugerencias generadas por SUNIA para optimizar tu consumo, solucionar problemas o aprovechar oportunidades de ahorro.",
            acciones: "Resumen de las tareas que SUNIA ha realizado o programado de forma automática para gestionar la energía de tu hogar de manera eficiente.",
        },
        devices: {
            climatizacion: (
                <div>
                    <p className="font-semibold mb-2">Sistema de Climatización Inteligente</p>
                    <ul className="space-y-1">
                        <li>• <b>Eco:</b> Mantiene la temperatura con mínimo consumo.</li>
                        <li>• <b>Turbo:</b> Enfría o calienta la estancia rápidamente.</li>
                        <li>• <b>Ventilación:</b> Mueve el aire sin cambiar la temperatura.</li>
                    </ul>
                </div>
            ),
            lavadora: "Programación automática en horas de máxima producción solar para minimizar el coste. Los modos permiten ajustar la intensidad del lavado.",
            lavavajillas: "Este dispositivo inicia su ciclo automáticamente cuando detecta un excedente de energía solar. Actualmente está sin conexión.",
            iluminacion: (
                <div>
                    <p className="font-semibold mb-2">Iluminación Adaptativa</p>
                    <ul className="space-y-1">
                        <li>• <b>Eco:</b> Luz tenue para máximo ahorro.</li>
                        <li>• <b>Normal:</b> Iluminación estándar para uso diario.</li>
                        <li>• <b>Luminoso:</b> Máxima intensidad para tareas que requieren más luz.</li>
                    </ul>
                </div>
            ),
            caldera: "Acumula agua caliente usando la energía solar sobrante durante el día para que esté disponible por la noche y a la mañana siguiente.",
            cargaVehiculo: "Carga tu vehículo eléctrico de forma inteligente, priorizando las horas de menor coste o mayor producción solar.",
            cortinasPosicion: "Abre o cierra las cortinas por zonas (Norte, Sur, etc.) para aprovechar el calor del sol en invierno o bloquearlo en verano.",
            cortinasApertura: "Permite un control fino del porcentaje de apertura de las cortinas para regular la cantidad de luz natural que entra en casa.",
            v2h: (
                <div>
                    <p className="font-semibold mb-2">Vehicle-to-Home (V2H)</p>
                    <p>Permite que la batería de tu coche alimente la casa durante picos de demanda o cortes de luz. <strong>Cancelado por la alerta meteorológica.</strong></p>
                </div>
            )
        },
        sensors: {
            temperatura: "Muestra la temperatura actual en las diferentes estancias de la casa. El color indica si está dentro del rango de confort.",
            electricidad: "Monitoriza en tiempo real los parámetros clave de tu instalación eléctrica. El consumo en 'Standby' elevado puede indicar un problema.",
            presencia: "Detecta movimiento en zonas clave para la seguridad y la gestión inteligente de la iluminación y la climatización."
        }
    };
    
    const sensorData = {
        temperatura: [ { name: 'Dorm. Principal', value: '21.5°C', status: 'green', icon: <Home size={16} /> }, { name: 'Salón', value: '22.1°C', status: 'green', icon: <Home size={16} /> }, { name: 'Dorm. Invitados', value: '20.8°C', status: 'green', icon: <Home size={16} /> }, { name: 'Cocina', value: '23.4°C', status: 'green', icon: <Flame size={16} /> }, ],
        electricidad: [ { name: 'Voltaje', value: '236V', status: 'green', icon: <Zap size={16} /> }, { name: 'Amperios', value: '5.76A', status: 'green', icon: <Gauge size={16} /> }, { name: 'Standby', value: '36Wh', status: 'yellow', icon: <Plug size={16} /> }, { name: 'Diferencial', value: '5mA', status: 'green', icon: <KeyRound size={16} /> }, ],
        presencia: [ { name: 'Entrada', value: 'Sin movimiento', status: 'gray', icon: <EyeOff size={16} /> }, { name: 'Lateral', value: 'Detectado', status: 'green', icon: <EyeOff size={16} /> }, { name: 'Cochera', value: 'Sin movimiento', status: 'gray', icon: <EyeOff size={16} /> }, { name: 'Iluminación', value: 'Se activará a las 20:55H', status: 'gray', icon: <Lightbulb size={16} /> }, ]
    };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans text-white p-4">
        {/* Encabezado y Alerta (sin cambios) */}
        <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-full shadow-lg mb-2"><Lightbulb size={40} /></div>
            <h1 className="text-4xl font-bold">Panel de Control de SUNIA</h1>
            <p className="text-slate-300 mt-1">Tu asistente energético inteligente.</p>
        </div>

        <div className="bg-yellow-500/10 border-l-4 border-yellow-400 text-yellow-200 p-4 rounded-r-lg mb-8">
            <div className="flex"><div className="py-1"><AlertTriangle className="text-yellow-400 mr-3"/></div>
                <div>
                    <p className="font-bold">Alerta Meteorológica: Tormenta de Arena Prevista para Mañana</p>
                    <p className="text-sm">Se espera una reducción drástica de la producción solar. SUNIA ha tomado las siguientes acciones:</p>
                    <ul className="list-disc list-inside text-sm mt-2">
                        <li>Adelantando electrodomésticos de alto consumo para hoy.</li>
                        <li>Programando carga del vehículo eléctrico al 100% esta noche.</li>
                        <li>Programada limpieza de placas solares para dentro de 3 días.</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Columnas de Info (sin cambios) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InfoColumn title="Avisos" icon={<AlertTriangle className="text-orange-400 mr-2"/>} helpContent={helpContent.sections.avisos}>
                <InfoItem icon={<Sun size={24} className="text-yellow-500"/>} text="Hoy se prevé buen clima, tendrás buena producción solar." time="Hace 5 minutos" />
                <InfoItem icon={<Wind size={24} className="text-blue-400"/>} text="Baja producción eólica durante la noche. Se priorizará la carga de la batería física." time="Hace 1 hora" />
            </InfoColumn>
            <InfoColumn title="Recomendaciones" icon={<Lightbulb className="text-green-400 mr-2"/>} helpContent={helpContent.sections.recomendaciones}>
                <InfoItem icon={<Zap size={24} className="text-slate-300"/>} text="Aprovecha la buena producción de energía actual para cualquier tarea que requiera alta demanda." time="Ahora mismo" />
                <InfoItem icon={<AlertCircle size={24} className="text-yellow-400"/>} text="Un sensor detecta mucho consumo en standby, revísalo!!!" time="Detectado a las 11:30" />
                <InfoItem icon={<WifiOff size={24} className="text-red-400"/>} text="Lavavajillas desconectado, no se ha podido iniciar el programa, revísalo!!!" time="Error a las 14:00" />
            </InfoColumn>
            <InfoColumn title="Acciones Automáticas" icon={<Zap className="text-purple-400 mr-2"/>} helpContent={helpContent.sections.acciones}>
                <InfoItem icon={<Fan size={24} className="text-slate-300"/>} text="Ventilación inteligente activada abriendo y cerrando persianas." time="Activo ahora" />
                <InfoItem icon={<Home size={24} className="text-slate-300"/>} text="Control de clima pasivo ajustando la posición de las cortinas." time="Activo ahora" />
                <InfoItem icon={<WashingMachine size={24} className="text-blue-400"/>} text="Buena producción solar: Se ha programado la lavadora (ECO) a las 16:00 para que termine a las 18:00." time="Programado" />
                <InfoItem icon={<Car size={24} className="text-red-400"/>} text="Gestión inteligente del vehículo: se usará la energía del vehículo esta noche para la vivienda y se cargará mañana por la mañana." time="Cancelado por tormenta" />
            </InfoColumn>
        </div>

        <h2 className="text-2xl font-bold mb-4">Dispositivos Inteligentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* --- INICIO TARJETA CLIMATIZACIÓN (MODIFICADA) --- */}
            <DeviceCard device={{ name: "Climatización", icon: <Snowflake/>, isOn: devices.climatizacion.isOn, hasWifi: true }} onToggle={() => handleToggle('climatizacion')} helpContent={helpContent.devices.climatizacion}>
                <div className="space-y-3">
                    <div className="bg-blue-500/10 text-blue-300 text-xs p-2 rounded-md font-semibold text-center">
                        Controlado por SunIA para aprovechar excedentes solares
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span>Modo:</span>
                        {devices.climatizacion.modes.map(mode => <button key={mode} onClick={() => handleModeChange('climatizacion', mode)} className={`${devices.climatizacion.activeMode === mode ? 'bg-blue-500/50' : 'bg-slate-700'} px-2 py-1 rounded hover:bg-slate-600`}>{mode}</button>)}
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="text-sm">Temp:</span>
                         <input 
                            type="range" 
                            min="18" 
                            max="26" 
                            value={devices.climatizacion.targetTemp} 
                            onChange={(e) => handleTempChange('climatizacion', e.target.value)}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="font-semibold w-10 text-center">{devices.climatizacion.targetTemp}°C</span>
                    </div>
                </div>
            </DeviceCard>
            {/* --- FIN TARJETA CLIMATIZACIÓN --- */}

            <DeviceCard device={{ name: "Lavadora", icon: <WashingMachine/>, isOn: devices.lavadora.isOn, hasWifi: true, description: "Programada para usar excedente solar..."}} onToggle={() => handleToggle('lavadora')} helpContent={helpContent.devices.lavadora}>
                <div><div className="flex justify-between items-center text-sm mb-1"><span>Progreso: Inicio 18:00</span><span>Final 20:30</span></div><div className="w-full bg-slate-700 rounded-full h-4"><div className="bg-blue-500 h-4 rounded-full" style={{width: '20%'}}></div></div></div>
                <div className="flex items-center gap-2 text-sm mt-2"><span>Modo:</span>{devices.lavadora.modes.map(mode => <button key={mode} onClick={() => handleModeChange('lavadora', mode)} className={`${devices.lavadora.activeMode === mode ? 'bg-blue-500/50' : 'bg-slate-700'} px-2 py-1 rounded hover:bg-slate-600`}>{mode}</button>)}</div>
            </DeviceCard>
            
            <DeviceCard device={{ name: "Lavavajillas", icon: <Disc/>, isOn: devices.lavavajillas.isOn, hasWifi: false, description: "Esperando momento óptimo..."}} onToggle={() => handleToggle('lavavajillas')} helpContent={helpContent.devices.lavavajillas}>
                <div className="bg-yellow-500/10 text-yellow-300 text-xs p-2 rounded-md font-semibold">Advertencia: Dispositivo sin conexión.</div>
                <div className="flex items-center gap-2 text-sm mt-2">
                    <span>Modo:</span>
                    {devices.lavavajillas.modes.map(mode => <button key={mode} onClick={() => handleModeChange('lavavajillas', mode)} className={`${devices.lavavajillas.activeMode === mode ? 'bg-blue-500/50' : 'bg-slate-700'} px-2 py-1 rounded hover:bg-slate-600`}>{mode}</button>)}
                </div>
            </DeviceCard>

            {/* --- INICIO TARJETA ILUMINACIÓN (MODIFICADA) --- */}
            <DeviceCard device={{ name: "Iluminación", icon: <Power/>, isOn: devices.iluminacion.isOn, hasWifi: true }} onToggle={() => handleToggle('iluminacion')} helpContent={helpContent.devices.iluminacion}>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span>Modo:</span>
                        {devices.iluminacion.modes.map(mode => <button key={mode} onClick={() => handleModeChange('iluminacion', mode)} className={`${devices.iluminacion.activeMode === mode ? 'bg-blue-500/50' : 'bg-slate-700'} px-2 py-1 rounded hover:bg-slate-600`}>{mode}</button>)}
                    </div>
                    <div className="flex items-center justify-around text-center text-sm mt-2 w-full pt-1">
                        <div>
                            <p className="font-bold">{currentIluminacion.progresivo}</p>
                            <p className="text-slate-400 text-xs">Progresivo</p>
                        </div>
                        <div>
                            <p className="font-bold">{currentIluminacion.presencia}</p>
                            <p className="text-slate-400 text-xs">Con Presencia</p>
                        </div>
                    </div>
                </div>
            </DeviceCard>
            {/* --- FIN TARJETA ILUMINACIÓN --- */}
            
            <DeviceCard device={{ name: "Caldera Eléctrica", icon: <Heater/>, isOn: devices.caldera.isOn, hasWifi: true, description: "Calentando agua con excedentes..."}} onToggle={() => handleToggle('caldera')} helpContent={helpContent.devices.caldera}>
                <div><div className="flex justify-between items-center text-sm mb-1"><span>Activa: 14:00 - 20:00</span><span>Objetivo 88°C</span></div><div className="w-full bg-slate-700 rounded-full h-4"><div className="bg-red-500 h-4 rounded-full" style={{width: '65%'}}></div></div></div>
            </DeviceCard>
            <DeviceCard device={{ name: "Carga Vehículo", icon: <Plug/>, isOn: devices.cargaVehiculo.isOn, hasWifi: true, description: "Carga inteligente programada..."}} helpContent={helpContent.devices.cargaVehiculo}>
                <div className="text-center font-semibold text-lg">30 kWh <span className="text-sm text-slate-400">(~180 km)</span></div>
            </DeviceCard>
            <DeviceCard device={{ name: "Persianas", icon: <PanelTop/>, isOn: devices.cortinasPosicion.isOn, hasWifi: true, description: "Optimización del ajuste térmico y lumínico"}} onToggle={() => handleToggle('cortinasPosicion')} helpContent={helpContent.devices.cortinasPosicion}>
                          <div className="space-y-2 text-sm">
                    <div><div className="flex justify-between"><span>Norte</span><span>30%</span></div><div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-slate-400 h-2 rounded-full" style={{width: '30%'}}></div></div></div>
                    <div><div className="flex justify-between"><span>Sur</span><span>15%</span></div><div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-slate-400 h-2 rounded-full" style={{width: '15%'}}></div></div></div>
                    <div><div className="flex justify-between"><span>Este</span><span>45%</span></div><div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-green-400 h-2 rounded-full" style={{width: '45%'}}></div></div></div>
                </div>

            </DeviceCard>
            <DeviceCard device={{ name: "Cortinas", icon: <PanelLeft/>, isOn: devices.cortinasApertura.isOn, hasWifi: true, description: "Optimización de luz y ventilación natural."}} onToggle={() => handleToggle('cortinasApertura')} helpContent={helpContent.devices.cortinasApertura}>
                 <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="bg-slate-700/50 p-2 rounded-md">Norte: <span className="font-bold text-blue-400">Cerradas</span></div>
                    <div className="bg-slate-700/50 p-2 rounded-md">Sur: <span className="font-bold text-blue-400">Cerradas</span></div>
                    <div className="bg-slate-700/50 p-2 rounded-md">Este: <span className="font-bold text-green-400">Abiertas</span></div>
                    <div className="bg-slate-700/50 p-2 rounded-md">Oeste: <span className="font-bold text-green-400">Abiertas</span></div>
                 </div>
            </DeviceCard>
            <DeviceCard device={{ name: "Vehículo a Hogar (V2H)", icon: <Car className="text-purple-400"/>, isOn: devices.v2h.isOn, hasWifi: true, description: "Usar la batería del coche..."}} onToggle={() => handleToggle('v2h')} helpContent={helpContent.devices.v2h}>
                <div className="bg-red-500/10 text-red-300 text-xs p-2 rounded-md font-semibold text-center">ACCIÓN CANCELADA</div>
            </DeviceCard>
        </div>
        
        {/* Sección de Sensores (sin cambios) */}
        <h2 className="text-2xl font-bold mb-4 mt-8">Sensores del Hogar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SensorCard title="Temperatura" icon={<Thermometer size={20} className="mr-2"/>} sensors={sensorData.temperatura} helpContent={helpContent.sensors.temperatura} />
            <SensorCard title="Monitor Eléctrico" icon={<Cpu size={20} className="mr-2"/>} sensors={sensorData.electricidad} helpContent={helpContent.sensors.electricidad} />
            <SensorCard title="Presencia" icon={<EyeOff size={20} className="mr-2"/>} sensors={sensorData.presencia} helpContent={helpContent.sensors.presencia} />
        </div>
    </div>
  );
}
