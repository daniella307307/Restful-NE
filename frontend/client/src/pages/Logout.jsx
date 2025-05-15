import React, { useState } from "react";
import { toast } from "react-toastify";

function Logout() {
  const [loggedOut, setIsLoggedOut] = useState(false);

  const logout = () => {
    setIsLoggedOut(true);

    // Show toast immediately
    toast.success("Logged out successfully!");

    // Clear token and redirect after a short delay to allow toast to show
    setTimeout(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 1500); // 1.5 seconds delay
  };

  if (!loggedOut) {
    return (
      <button
        type="button"           // button type should be "button" to avoid accidental form submits
        onClick={logout}        // onClick instead of onSubmit
        className="bg-blue-800 text-white animate-bounce p-2 rounded-xl"
      >
        Logout
      </button>
    );
  }

  // Loading animation while "logging out"
  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="relative w-24 h-24">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translate(0, -48px)`,
              animationDelay: `${i * 0.125}s`,
            }}
          />
        ))}
      </div>
      <p className="mt-8 text-blue-500 text-lg">
        Please wait while we log you out...
      </p>
    </div>
  );
}

export default Logout;
