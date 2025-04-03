import React, { useState } from "react";

const AttendancePanel = ({ token }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("none"); // 'none', 'clocked-in', 'break'

  const handleAction = async (action) => {
    try {
      const res = await fetch(`/api/attendance/${action}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        if (action === "clockin") setStatus("clocked-in");
        else if (action === "clockout") setStatus("none");
        else if (action === "break") setStatus("break");
        setShowModal(false);
      } else {
        const errData = await res.json();
        alert(errData.message || "Action failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="p-4">
      {token && (
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-md shadow-md hover:bg-orange-600"
        >
          {status === "clocked-in"
            ? "Clocked In"
            : status === "break"
            ? "On Break"
            : "Clock In"}
        </button>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold">Select Attendance Action</h2>
            <div className="flex flex-col space-y-2">
              {status === "none" && (
                <button
                  onClick={() => handleAction("clockin")}
                  className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  Clock In
                </button>
              )}
              {status === "clocked-in" && (
                <>
                  <button
                    onClick={() => handleAction("clockout")}
                    className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
                  >
                    Clock Out
                  </button>
                  <button
                    onClick={() => handleAction("break")}
                    className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                  >
                    Take a Break
                  </button>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePanel;
