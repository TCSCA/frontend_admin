import { useState, useCallback, useMemo, JSX, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown, X } from "lucide-react";

// Interfaz para las propiedades del componente
interface TimePickerProps {
  /** Función de callback que se dispara cuando cambia la hora, devolviendo la hora en formato HH:MM A/PM */
  onTimeChange?: (time: string) => void;
  /** Valor inicial de la hora (ej: '03:30 PM') */
  initialTime?: string;
  /** Paso de minutos, por defecto 5 (0, 5, 10, 15, ...) */
  minuteStep?: number;
  /** Etiqueta a mostrar cuando el campo está vacío (aunque el componente siempre tendrá una hora inicial) */
  placeholder?: string;
}

// Valores por defecto
const DEFAULT_HOUR = 12;
const DEFAULT_MINUTE = 0;
const DEFAULT_PERIOD: "AM" | "PM" = "PM";

// Función utilitaria para parsear la hora inicial
const parseInitialTime = (
  timeString: string | undefined
): { h: number; m: number; p: "AM" | "PM" } => {
  console.log("initial time", timeString);
  if (!timeString) {
    return { h: DEFAULT_HOUR, m: DEFAULT_MINUTE, p: DEFAULT_PERIOD };
  }
  const match = timeString.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (match) {
    const hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const period = match[3].toUpperCase() as "AM" | "PM";
    console.log("sdasdasd", { h: hour, m: minute, p: period });
    return { h: hour, m: minute, p: period };
  }
  return { h: DEFAULT_HOUR, m: DEFAULT_MINUTE, p: DEFAULT_PERIOD };
};

// Componente TimePicker
export default function TimePicker({
  onTimeChange = () => {},
  initialTime,
  minuteStep = 5,
  placeholder = "Selecciona una hora",
}: TimePickerProps) {
  const parsedTime = useMemo(
    () => parseInitialTime(initialTime),
    [initialTime]
  );

  const [hour, setHour] = useState<number>(parsedTime.h);
  const [minute, setMinute] = useState<number>(parsedTime.m);
  const [period, setPeriod] = useState<"AM" | "PM">(parsedTime.p);
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el dropdown

  useEffect(() => {
    setHour(parsedTime.h);
    setMinute(parsedTime.m);
    setPeriod(parsedTime.p);
  }, [initialTime, parsedTime]);
  // Genera la hora formateada y llama al callback
  const updateTime = useCallback(
    (h: number, m: number, p: "AM" | "PM") => {
      const time12h = `${String(h).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )} ${p}`;
      const time24h = to24hFormat(h, m, p); // <-- Calcula el formato 24h

      // Llama al callback con ambos formatos
      onTimeChange(time24h);
    },
    [onTimeChange]
  );

  const to24hFormat = (h: number, m: number, p: "AM" | "PM"): string => {
    let hour24 = h;

    if (p === "PM" && h !== 12) {
      hour24 += 12;
    } else if (p === "AM" && h === 12) {
      hour24 = 0; // Medianoche (12 AM) es 00:00
    }

    const formattedHour24 = String(hour24).padStart(2, "0");
    const formattedMinute = String(m).padStart(2, "0");

    return `${formattedHour24}:${formattedMinute}`;
  };

  // Manejadores para los cambios de hora/minuto/periodo
  const handleHourChange = useCallback(
    (newHour: number) => {
      setHour(newHour);
      updateTime(newHour, minute, period);
    },
    [minute, period, updateTime]
  );

  const handleMinuteChange = useCallback(
    (newMinute: number) => {
      setMinute(newMinute);
      updateTime(hour, newMinute, period);
    },
    [hour, period, updateTime]
  );

  const handlePeriodToggle = useCallback(() => {
    const newPeriod = period === "AM" ? "PM" : "AM";
    setPeriod(newPeriod);
    updateTime(hour, minute, newPeriod);
  }, [hour, minute, period, updateTime]);

  // Lógica para incrementar/decrementar la hora
  const adjustTime = useCallback(
    (unit: "hour" | "minute", direction: "up" | "down") => {
      if (unit === "hour") {
        let newHour = hour + (direction === "up" ? 1 : -1);
        if (newHour > 12) newHour = 1;
        if (newHour < 1) newHour = 12;
        handleHourChange(newHour);
      } else if (unit === "minute") {
        let newMinute =
          minute + (direction === "up" ? minuteStep : -minuteStep);

        // Manejar el desbordamiento de minutos a horas
        if (newMinute >= 60) {
          newMinute = 0;
          adjustTime("hour", "up");
        } else if (newMinute < 0) {
          newMinute = 60 - minuteStep;
          adjustTime("hour", "down");
        }

        // Asegurarse de que el minuto sea un múltiplo del paso
        newMinute = Math.round(newMinute / minuteStep) * minuteStep;
        if (newMinute === 60) newMinute = 0;

        handleMinuteChange(newMinute);
      }
    },
    [hour, minute, period, minuteStep, handleHourChange, handleMinuteChange]
  );

  // Opciones para las horas (1 a 12)
  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  // Opciones para los minutos (según el paso definido)
  const minutes = useMemo(() => {
    const mins = [];
    for (let i = 0; i < 60; i += minuteStep) {
      mins.push(i);
    }
    return mins;
  }, [minuteStep]);

  // Componente interno para el selector de unidad
  const TimeUnitSelector: (props: {
    label: "hour" | "minute";
    value: number;
    options: number[];
    onChange: (val: number) => void;
  }) => JSX.Element = ({ label, value, options, onChange }) => {
    const formattedValue = String(value).padStart(2, "0");

    return (
      <div className="flex flex-col items-center justify-center space-y-1">
        <button
          onClick={() => adjustTime(label, "up")}
          className="p-1 rounded-full text-blue-500 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Incrementar ${label === "hour" ? "hora" : "minuto"}`}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-lg w-16 text-center shadow-inner transition-transform hover:scale-[1.02]">
          {formattedValue}
        </span>
        <button
          onClick={() => adjustTime(label, "down")}
          className="p-1 rounded-full text-blue-500 hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Decrementar ${label === "hour" ? "hora" : "minuto"}`}
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const formattedTimeDisplay = `${String(hour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")} ${period}`;

  // Para simular el comportamiento de placeholder si no hay hora inicial (aunque siempre hay por defecto)
  const isDefaultTime =
    hour === DEFAULT_HOUR &&
    minute === DEFAULT_MINUTE &&
    period === DEFAULT_PERIOD &&
    initialTime === undefined;

  return (
    <div className="relative w-full ">
      {/* 1. Campo de Entrada (Display estilo input) */}
      <div
        className={`
          flex items-center justify-between p-3 pl-10 border border-gray-300 bg-gray-100 text-gray-800 
          rounded-xl shadow-inner cursor-pointer transition-all duration-200 
          focus-within:ring-2 focus-within:ring-blue-500 hover:border-blue-500
          ${isDefaultTime ? "text-gray-400" : "text-gray-800 font-medium"}
        `}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="time-picker-dropdown"
        tabIndex={0}
      >
        <span
          className={
            isDefaultTime ? "text-sm text-gray-400" : "text-sm text-gray-800"
          }
        >
          {isDefaultTime ? placeholder : formattedTimeDisplay}
        </span>
        {/* Icono de Reloj */}
        <Clock className="w-5 h-5 text-gray-500" />
      </div>

      {/* 2. Dropdown Selector (Aparece al hacer click) */}
      {isOpen && (
        <div
          id="time-picker-dropdown"
          // Reducido de p-5 a p-4
          className="absolute z-50 mt-2 p-4 bg-white border border-gray-300 rounded-xl shadow-xl w-full sm:max-w-xs"
          // Usamos 'top-full' para asegurar que el dropdown no se solape con el input en el móvil
          style={{ top: "calc(100% + 8px)" }}
        >
          {/* Encabezado con Botón de Cerrar */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
            {/* Reducido de text-xl a text-lg */}
            <h3 className="text-sm font-bold text-gray-800">Selecciona Hora</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Cerrar selector de hora"
            >
              {/* Reducido de w-6 h-6 a w-5 h-5 */}
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid de Selección de Hora */}
          <div className="flex items-center justify-center space-x-3">
            {/* Selector de Horas */}
            <TimeUnitSelector
              label="hour"
              value={hour}
              options={hours}
              onChange={handleHourChange}
            />

            {/* Separador (mantiene tamaño grande por estética) */}
            <span className="text-4xl font-extrabold text-gray-400 pb-1">
              :
            </span>

            {/* Selector de Minutos */}
            <TimeUnitSelector
              label="minute"
              value={minute}
              options={minutes}
              onChange={handleMinuteChange}
            />

            {/* Selector AM/PM */}
            <div className="flex flex-col space-y-2 ml-2">
              <button
                onClick={() => handlePeriodToggle()}
                // Reducido de py-2 px-3 text-sm a py-1.5 px-2 text-xs
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm ${
                  period === "AM"
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                AM
              </button>
              <button
                onClick={() => handlePeriodToggle()}
                // Reducido de py-2 px-3 text-sm a py-1.5 px-2 text-xs
                className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm ${
                  period === "PM"
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
