import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import './Calendar.css';

interface CalendarItem {
  uniqueId: string;
  content: string;
}

type CalendarItemsState = Record<number, CalendarItem[]>;

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [draggedItem, setDraggedItem] = useState<CalendarItem | null>(null);
  const [calendarItems, setCalendarItems] = useState<CalendarItemsState>({});
  const [draggableItems, setDraggableItems] = useState<CalendarItem[]>([
    { uniqueId: nanoid(), content: 'Item 1' },
    { uniqueId: nanoid(), content: 'Item 2' },
  ]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderDays = (): JSX.Element[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: JSX.Element[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className="calendar-day"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(day)}
        >
          <div className="date-number">{day}</div>
          <div className="calendar-items">
            {calendarItems[day]?.map((item) => (
              <div
                key={item.uniqueId}
                className="calendar-item"
                draggable
                onDragStart={() => handleDragStart(item)}
              >
                {item.content}
                <button
                  className="delete-button"
                  onClick={() => handleDelete(day, item.uniqueId)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDragStart = (item: CalendarItem | string) => {
    if (typeof item === 'string') {
      // Dragging from the source items ("Item 1" or "Item 2")
      const newItem: CalendarItem = {
        uniqueId: nanoid(), // New ID for the dragged item
        content: item,
      };
      console.log('Drag Start:', newItem.uniqueId);
      setDraggedItem(newItem);
    } else {
      // Dragging an existing item within the calendar
      console.log('Drag Start:', item.uniqueId);
      setDraggedItem(item);
    }
  };

  const handleDrop = (day: number) => {
    if (draggedItem) {
      const newItem = {
        ...draggedItem,
        uniqueId: nanoid(), // New ID when dropped
      };
      console.log('Drop:', newItem.uniqueId);
      setCalendarItems((prevItems) => {
        const newItems = { ...prevItems };
        if (!newItems[day]) newItems[day] = [];
        // Check if the item already exists in the calendar for that day
        const itemExists = newItems[day].some(item => item.content === draggedItem.content);
        if (!itemExists) {
          newItems[day].push(newItem);
        }
        return newItems;
      });
      setDraggableItems((prevItems) => prevItems.filter(item => item.uniqueId !== draggedItem.uniqueId));
      setDraggedItem(null);
    }
  };

  const handleDelete = (day: number, uniqueId: string) => {
    console.log('Delete:', uniqueId);
    setCalendarItems((prevItems) => {
      const newItems = { ...prevItems };
      newItems[day] = newItems[day]?.filter((item) => item.uniqueId !== uniqueId);
      if (newItems[day]?.length === 0) delete newItems[day];
      return newItems;
    });
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>Prev</button>
        <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
        <button onClick={handleNextMonth}>Next</button>
      </div>
      <div className="calendar-days">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="calendar-day-header">{day}</div>
        ))}
        {renderDays()}
      </div>
      <div className="draggable-items">
        {draggableItems.map(item => (
          <div
            key={item.uniqueId}
            className="draggable-item"
            draggable
            onDragStart={() => handleDragStart(item.content)}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;