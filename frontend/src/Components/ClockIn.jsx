import React, { useState } from 'react';
import axios from 'axios';

const ClockInButton = ({ employeeId }) => {
    const [message, setMessage] = useState('');

    const handleClockIn = async () => {
        try {
            const response = await axios.post(`/api/employees/${employeeId}/clock-in`);
            setMessage(response.data.message);
        } catch (error) {
            if(error.response){
                setMessage(error.response.data.message);
            }else{
                setMessage('An error occured while clocking in.');
            }
        }
    };

    return (
        <div>
            <button onClick={handleClockIn}>Clock In</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ClockInButton;

