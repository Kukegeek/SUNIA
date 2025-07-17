// src/components/SuniaDashboard.jsx

import { useState } from 'react';
import { 
    AlertTriangle, Lightbulb, Zap, Thermometer, WashingMachine, Disc, Car, Plug, Power, Wifi, WifiOff, 
    CheckCircle, XCircle, AlertCircle, Home, Snowflake, Flame, Minus, Wind, Cpu, EyeOff, KeyRound, Gauge,
    PanelTop, PanelLeft, PanelRight, Heater, Droplets, Sun, Fan // Nuevos iconos
} from 'lucide-react';

// --- SUB-COMPONENTES AUXILIARES (sin cambios) ---

const InfoColumn = ({ title, icon, children }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-3 flex items-center">{icon}{title}</h3>
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

const DeviceCard = ({ device, onToggle, children }) => (
    <div className={`bg-slate-800/50 p-4 rounded-lg flex flex-col gap-3 transition-opacity duration-300 ${!device.isOn ? 'opacity-50' : ''}`}>
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
        <p className="text-sm text-slate-300">{device.description}</p>
        {children}
    </div>
);

const SensorCard = ({ title, icon, sensors }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg">
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
);


// --- COMPONENTE PRINCIPAL ---
export default function SuniaDashboard() {
    const [devices, setDevices] = useState({
        climatizacion: { isOn: true, mode: 'Inercia' },
        lavadora: { isOn: true, modes: ['ECO', 'Delicada', 'Sucio'], activeMode: 'ECO' },
        lavavajillas: { isOn: false, modes: ['eco', 'sucio', 'brillante', 'seco'], activeMode: 'eco', hasWifi: false },
        iluminacion: { isOn: true, mode: 'ECO' },
        cargaVehiculo: { isOn: true },
        caldera: { isOn: true, mode: 'Auto' },
        cortinasPosicion: { isOn: true },
        cortinasApertura: { isOn: true },
        v2h: { isOn: false },
    });

    const handleToggle = (deviceId) => { setDevices(prev => ({ ...prev, [deviceId]: { ...prev[deviceId], isOn: !prev[deviceId].isOn } })); };
    const handleModeChange = (deviceId, newMode) => { setDevices(prev => ({ ...prev, [deviceId]: { ...prev[deviceId], activeMode: newMode } })); };
    
    const sensorData = {
        temperatura: [
            { name: 'Dorm. Principal', value: '21.5°C', status: 'green', icon: <Home size={16} /> },
            { name: 'Salón', value: '22.1°C', status: 'green', icon: <Home size={16} /> },
            { name: 'Dorm. Invitados', value: '20.8°C', status: 'green', icon: <Home size={16} /> },
            { name: 'Cocina', value: '23.4°C', status: 'green', icon: <Flame size={16} /> },
        ],
        electricidad: [
            { name: 'Voltaje', value: '236V', status: 'green', icon: <Zap size={16} /> },
            { name: 'Amperios', value: '5.76A', status: 'green', icon: <Gauge size={16} /> },
            { name: 'Standby', value: '36Wh', status: 'yellow', icon: <Plug size={16} /> },
            { name: 'Diferencial', value: '5mA', status: 'green', icon: <KeyRound size={16} /> },
        ],
        presencia: [
            { name: 'Entrada', value: 'Sin movimiento', status: 'gray', icon: <EyeOff size={16} /> },
            { name: 'Lateral', value: 'Detectado', status: 'green', icon: <EyeOff size={16} /> },
            { name: 'Cochera', value: 'Sin movimiento', status: 'gray', icon: <EyeOff size={16} /> },
            { name: 'Iluminación', value: 'Se activará a las 20:55H', status: 'gray', icon: <Lightbulb size={16} /> },
        ]
    };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans text-white">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InfoColumn title="Avisos" icon={<AlertTriangle className="text-orange-400 mr-2"/>}>
                <InfoItem icon={<Sun size={24} className="text-yellow-500"/>} text="Hoy se prevé buen clima, tendrás buena producción solar." time="Hace 5 minutos" />
                <InfoItem icon={<Wind size={24} className="text-blue-400"/>} text="Baja producción eólica durante la noche. Se priorizará la carga de la batería física." time="Hace 1 hora" />
            </InfoColumn>

            <InfoColumn title="Recomendaciones" icon={<Lightbulb className="text-green-400 mr-2"/>}>
                <InfoItem icon={<Zap size={24} className="text-slate-300"/>} text="Aprovecha la buena producción de energía actual para cualquier tarea que requiera alta demanda." time="Ahora mismo" />
                <InfoItem icon={<AlertCircle size={24} className="text-yellow-400"/>} text="Un sensor detecta mucho consumo en standby, revísalo!!!" time="Detectado a las 11:30" />
                <InfoItem icon={<WifiOff size={24} className="text-red-400"/>} text="Lavavajillas desconectado, no se ha podido iniciar el programa, revísalo!!!" time="Error a las 14:00" />
            </InfoColumn>

            <InfoColumn title="Acciones Automáticas" icon={<Zap className="text-purple-400 mr-2"/>}>
                <InfoItem icon={<Fan size={24} className="text-slate-300"/>} text="Ventilación inteligente activada abriendo y cerrando persianas." time="Activo ahora" />
                <InfoItem icon={<Home size={24} className="text-slate-300"/>} text="Control de clima pasivo ajustando la posición de las cortinas." time="Activo ahora" />
                <InfoItem icon={<WashingMachine size={24} className="text-blue-400"/>} text="Buena producción solar: Se ha programado la lavadora (ECO) a las 16:00 para que termine a las 18:00." time="Programado" />
                <InfoItem icon={<Car size={24} className="text-red-400"/>} text="Gestión inteligente del vehículo: se usará la energía del vehículo esta noche para la vivienda y se cargará mañana por la mañana." time="Cancelado por tormenta" />
            </InfoColumn>
        </div>

        <h2 className="text-2xl font-bold mb-4">Dispositivos Inteligentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DeviceCard device={{ name: "Climatización", icon: <Snowflake/>, isOn: devices.climatizacion.isOn, hasWifi: true, description: "Aclimatando la casa con excedente para mantener una temperatura estable."}} onToggle={() => handleToggle('climatizacion')}>
                <div className="text-center font-semibold text-lg">21°C <span className="text-sm text-slate-400">(Objetivo)</span></div>
            </DeviceCard>
            <DeviceCard device={{ name: "Lavadora", icon: <WashingMachine/>, isOn: devices.lavadora.isOn, hasWifi: true, description: "Programada para usar excedente solar y estar lista a tu llegada."}} onToggle={() => handleToggle('lavadora')}>
                <div><div className="flex justify-between items-center text-sm mb-1"><span>Progreso: Inicio 18:00</span><span>Final 20:30</span></div><div className="w-full bg-slate-700 rounded-full h-4"><div className="bg-blue-500 h-4 rounded-full" style={{width: '20%'}}></div></div></div>
                <div className="flex items-center gap-2 text-sm mt-2"><span>Modo:</span>{devices.lavadora.modes.map(mode => <button key={mode} onClick={() => handleModeChange('lavadora', mode)} className={`${devices.lavadora.activeMode === mode ? 'bg-blue-500/50' : 'bg-slate-700'} px-2 py-1 rounded hover:bg-slate-600`}>{mode}</button>)}</div>
            </DeviceCard>
            <DeviceCard device={{ name: "Lavavajillas", icon: <Disc/>, isOn: devices.lavavajillas.isOn, hasWifi: false, description: "Esperando momento óptimo para iniciar el ciclo."}} onToggle={() => handleToggle('lavavajillas')}>
                <div className="bg-yellow-500/10 text-yellow-300 text-xs p-2 rounded-md font-semibold">Advertencia: No se ha podido iniciar el programa. Dispositivo sin conexión.</div>
            </DeviceCard>
            <DeviceCard device={{ name: "Iluminación", icon: <Power/>, isOn: devices.iluminacion.isOn, hasWifi: true, description: "Ajuste progresivo al atardecer y por presencia."}}>
                 <div className="flex items-center justify-around text-center text-sm mt-2"><div><p className="font-bold">10-35%</p><p className="text-slate-400">Progresivo</p></div><div><p className="font-bold">60%</p><p className="text-slate-400">Con Presencia</p></div></div>
            </DeviceCard>
            <DeviceCard device={{ name: "Caldera Eléctrica", icon: <Heater/>, isOn: devices.caldera.isOn, hasWifi: true, description: "Calentando agua con excedentes para uso nocturno."}} onToggle={() => handleToggle('caldera')}>
                <div><div className="flex justify-between items-center text-sm mb-1"><span>Activa: 14:00 - 20:00</span><span>Objetivo 88°C</span></div><div className="w-full bg-slate-700 rounded-full h-4"><div className="bg-red-500 h-4 rounded-full" style={{width: '65%'}}></div></div></div>
            </DeviceCard>
            <DeviceCard device={{ name: "Carga Vehículo", icon: <Plug/>, isOn: devices.cargaVehiculo.isOn, hasWifi: true, description: "Carga inteligente programada de 08:00 a 13:00 para mañana."}}>
                <div className="text-center font-semibold text-lg">30 kWh <span className="text-sm text-slate-400">(~180 km)</span></div>
            </DeviceCard>
            <DeviceCard device={{ name: "Cortinas (Posición)", icon: <PanelTop/>, isOn: devices.cortinasPosicion.isOn, hasWifi: true, description: "Ajuste automático para optimizar ganancia térmica y lumínica."}} onToggle={() => handleToggle('cortinasPosicion')}>
                 <div className="grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="bg-slate-700/50 p-2 rounded-md">Norte: <span className="font-bold text-blue-400">Cerradas</span></div>
                    <div className="bg-slate-700/50 p-2 rounded-md">Sur: <span className="font-bold text-blue-400">Cerradas</span></div>
                    <div className="bg-slate-700/50 p-2 rounded-md">Este: <span className="font-bold text-green-400">Abiertas</span></div>
                    <div className="bg-slate-700/50 p-2 rounded-md">Oeste: <span className="font-bold text-green-400">Abiertas</span></div>
                 </div>
            </DeviceCard>
            <DeviceCard device={{ name: "Cortinas (Apertura %)", icon: <PanelLeft/>, isOn: devices.cortinasApertura.isOn, hasWifi: true, description: "Ajuste fino de la apertura para control preciso de la luz."}} onToggle={() => handleToggle('cortinasApertura')}>
                <div className="space-y-2 text-sm">
                    <div><div className="flex justify-between"><span>Norte</span><span>40%</span></div><div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-slate-400 h-2 rounded-full" style={{width: '40%'}}></div></div></div>
                    <div><div className="flex justify-between"><span>Sur</span><span>10%</span></div><div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-slate-400 h-2 rounded-full" style={{width: '10%'}}></div></div></div>
                    <div><div className="flex justify-between"><span>Este</span><span>100%</span></div><div className="w-full bg-slate-700 h-2 rounded-full"><div className="bg-green-400 h-2 rounded-full" style={{width: '100%'}}></div></div></div>
                </div>
            </DeviceCard>
            <DeviceCard device={{ name: "Vehículo a Hogar (V2H)", icon: <Car className="text-purple-400"/>, isOn: devices.v2h.isOn, hasWifi: true, description: "Usar la batería del coche para alimentar la casa durante la noche."}} onToggle={() => handleToggle('v2h')}>
                <div className="bg-red-500/10 text-red-300 text-xs p-2 rounded-md font-semibold text-center">ACCIÓN CANCELADA POR ALERTA DE TORMENTA</div>
            </DeviceCard>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 mt-8">Sensores del Hogar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SensorCard title="Temperatura" icon={<Thermometer size={20} className="mr-2"/>} sensors={sensorData.temperatura}/>
            <SensorCard title="Monitor Eléctrico" icon={<Cpu size={20} className="mr-2"/>} sensors={sensorData.electricidad}/>
            <SensorCard title="Presencia" icon={<EyeOff size={20} className="mr-2"/>} sensors={sensorData.presencia}/>
        </div>
    </div>
  );
}
