import React from 'react';

function Loader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="relative w-24 h-24">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-blue-500 rounded-full animate-ping"
            style={{
              top: '50%',
              left: '50%',
              transform: `
                rotate(${i * 45}deg) 
                translate(0, -48px)
              `,
              animationDelay: `${i * 0.125}s`,
            }}
          />
        ))}
      </div>
      <p className="mt-8 text-blue-500 text-lg">Preparing your experience...</p>
    </div>
  );
}

export default Loader;
