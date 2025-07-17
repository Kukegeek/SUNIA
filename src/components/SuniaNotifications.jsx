import React from 'react';

const SuniaNotifications = () => {
  const notifications = [
    {
      type: 'info',
      icon: '☀️',
      message: 'Hoy se prevé buen clima, tendrás buena producción solar.'
    }
  ];

  const recommendations = [
    {
      icon: '⚡',
      message: 'Aprovecha la buena producción de energía actual para cualquier tarea que requiera alta demanda.',
      reward: '¡¡Conseguirás 5 SOLARIS EXTRA!!'
    },
    {
      icon: '🧽',
      message: 'Últimamente tus paneles solares bajo condiciones idóneas no generan toda la energía que deberían, pueden tener algún problema o simplemente estar sucios, hace 3 meses desde la última limpieza.',
      reward: '¡¡5 Solaris extras serán tuyos!!'
    }
  ];

  const actions = [
    {
      icon: '🌞',
      title: 'Buena producción Solar, voy a aprovecharla:',
      description: 'Hora de llegada prevista a casa 18H, se va a programar la lavadora con el programa eco, con 2 horas de duración a las 16:00H, para que finalice cuando llegues a casa.'
    },
    {
      icon: '🚗',
      title: 'Gestión inteligente del vehículo eléctrico:',
      description: 'Según tu agenda mañana no tienes previsto usar el vehículo eléctrico hasta las 18.00, para acudir a tu cita de restaurante, por lo que se usará la energía del vehículo durante la noche para la vivienda, y se cargará mañana desde primera hora, ya que hará buen clima y el trayecto previsto es corto.'
    },
    {
      icon: '🔋',
      title: 'Optimización energética nocturna:',
      description: 'Se ha detectado que el vehículo eléctrico llegará a las 20h y con energía suficiente para abastecer a la vivienda, y como no lo usarás hasta la cita de las 18h tendrá tiempo de recargar a primera hora de la mañana con energía solar.'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Centro de Notificaciones SUNIA</h2>
      </div>

      {/* Avisos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📢</span> Avisos
        </h3>
        {notifications.map((notification, index) => (
          <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{notification.icon}</span>
              <p className="text-blue-700">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recomendaciones */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">💡</span> Recomendaciones
        </h3>
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-green-50 border-l-4 border-green-400 p-4 mb-3">
            <div className="flex items-start">
              <span className="text-2xl mr-3 mt-1">{rec.icon}</span>
              <div>
                <p className="text-green-700 mb-2">{rec.message}</p>
                <p className="text-green-600 font-semibold text-sm">{rec.reward}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">⚙️</span> Acciones en Curso y Futuras
        </h3>
        {actions.map((action, index) => (
          <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-3">
            <div className="flex items-start">
              <span className="text-2xl mr-3 mt-1">{action.icon}</span>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">{action.title}</h4>
                <p className="text-yellow-700 text-sm">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuniaNotifications;