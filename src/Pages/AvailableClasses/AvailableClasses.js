import React, { useEffect, useState } from "react";
import PrimaryButton from "../../Components/Buttons/PrimaryButton";
import {
    dayOptions,
    getCurrentTimeSlot,
    roomTypes,
    timeOptions,
} from "../../data/daysAndTimeSlots";

const AvailableClasses = () => {
    const currentDay = new Date().toLocaleString("en-us", { weekday: "long" }).toUpperCase();
    const currentTime = getCurrentTimeSlot();
    const [availableClassrooms, setAvailableClassrooms] = useState({});
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [selectedTime, setSelectedTime] = useState(currentTime);
    const [selectedRoomType, setSelectedRoomType] = useState("all");
    const [results, setResults] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/data.json");
            const data = await response.json();
            setAvailableClassrooms(data.availableRooms);
        }
        fetchData();
    }, []);

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
        
    };
    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
      
    };
    const handleRoomChange = (event) => {
        setSelectedRoomType(event.target.value);
    };

  
    const handleOnSubmit = (event) => {
        event.preventDefault();
        if (selectedDay && selectedTime) {
            let filteredResults = availableClassrooms[selectedDay][selectedTime];
            if (selectedRoomType === "regularClassrooms") {
                filteredResults = filteredResults.filter(room => !room.endsWith("L"));
            } else if (selectedRoomType === "labClassrooms") {
                filteredResults = filteredResults.filter(room => room.endsWith("L"));
            }
            setResults(filteredResults);
        }
    };

    return (
        <div>
            <form action="" onSubmit={handleOnSubmit} className="mx-3">
                <div className="sm:flex justify-center sm:space-x-4 space-y-3 sm:space-y-0">
                    <select
                        id="day"
                        className="select"
                        onChange={handleDayChange}
                        value={selectedDay}
                    >
                        <option value="" disabled>
                            🌱 Select day
                        </option>
                        {dayOptions?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        id="time"
                        className="select"
                        onChange={handleTimeChange}
                        value={selectedTime}
                    >
                        <option value="" disabled>
                            ⏰ Select time slot
                        </option>
                        {timeOptions?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <select
                        id="room"
                        className="select"
                        onChange={handleRoomChange}
                        value={selectedRoomType}
                    >
                        <option value="" disabled>
                            🏢 Select Room Type
                        </option>
                        {roomTypes?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <PrimaryButton
                    type="submit"
                    // label="Check Available Rooms"
                    label={selectedDay && selectedTime ? "Check Available Rooms" : "Select Day and Time"}
                    className={`mt-4  ${ selectedDay && selectedTime ? 'btn' : ' btnd'}`}
                    disabled={!selectedDay || !selectedTime}
                />

            </form>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-6 mx-3">
                {results?.map((result) => (
                    <div
                        className={`py-4 px-4 border rounded ${result.endsWith("L")
                                ? `bg-blue-100 dark:bg-blue-800/30 dark:border-blue-600/30`
                                : `bg-gray-50 dark:bg-gray-700 dark:border-gray-600`
                            }`}
                        key={result}
                    >
                        <p>{result}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableClasses;
