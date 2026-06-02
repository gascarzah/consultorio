import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export const MyCalendar = ({setFechaSelected, getCitasHoy}) => {
  const [dateRange, setDateRange] = useState(null);
  const [formattedDate, setFormattedDate] = useState('')
  const today = new Date();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleOnChange = (date) => {
    setDateRange(date);
    const formatted = formatDate(date);
    setFormattedDate(formatted);
    getCitasHoy(formatted)
  }

  const tileClassName = ({ date }) => {
    if (date.toDateString() === today.toDateString()) {
      return "highlight-today";
    }
    if (dateRange && date.toDateString() === dateRange.toDateString()) {
      return "selected-day";
    }
    if (date.getDay() === 6) {
      return "no-red-saturday";
    }
    return "";
  };

  const NavigationArrow = ({ direction }) => (
    <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-sky-50 transition-all duration-200">
      <svg 
        className="w-5 h-5 text-sky-600" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d={direction === 'prev' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Calendar
        onChange={handleOnChange}
        value={dateRange}
        tileClassName={tileClassName}
        calendarType="gregory"
        className="w-full border-none shadow-none"
        navigationLabel={({ date }) => {
          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          return `${months[date.getMonth()]} ${date.getFullYear()}`;
        }}
        prevLabel={<NavigationArrow direction="prev" />}
        nextLabel={<NavigationArrow direction="next" />}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
};