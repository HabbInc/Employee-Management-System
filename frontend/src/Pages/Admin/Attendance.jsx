import React from 'react'
import axios from 'axios';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get('/api/admin/attendance/today');
                setAttendanceData(response.data.attendance);
            } catch (error) {
                console.error("Failed to fetch attendance:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Today's Attendance</h2>
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Clock In</th>
                        <th className="p-2 border">Clock Out</th>
                        <th className="p-2 border">Total Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((record, index) => (
                        <tr key={index} className="text-center">
                            <td className="p-2 border">{record.name}</td>
                            <td className="p-2 border">{record.email}</td>
                            <td className="p-2 border">{record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : 'N/A'}</td>
                            <td className="p-2 border">{record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : 'N/A'}</td>
                            <td className="p-2 border">{record.totalHours ? record.totalHours.toFixed(2) + ' hrs' : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance