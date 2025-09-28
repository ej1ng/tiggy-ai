import React from 'react';

const ConfettiPiece: React.FC<{ initialX: number, initialY: number, rotation: number, delay: number, color: string }> = ({ initialX, initialY, rotation, delay, color }) => {
  // FIX: Cast style object to React.CSSProperties to allow for CSS custom properties.
  const style = {
    '--initial-x': `${initialX}vw`,
    '--initial-y': `${initialY}vh`,
    '--rotation': `${rotation}deg`,
    animationDelay: `${delay}s`,
    backgroundColor: color,
  } as React.CSSProperties;
  return <div className="confetti-piece" style={style}></div>;
};

const Confetti: React.FC = () => {
  const pieces = Array.from({ length: 150 }).map((_, i) => {
    const colors = ['#fde19a', '#f4a261', '#e76f51', '#2a9d8f', '#264653', '#e9c46a'];
    return {
      id: i,
      initialX: Math.random() * 100,
      initialY: -10 - Math.random() * 20,
      rotation: Math.random() * 360,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  });

  return (
    <>
      <style>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1000;
          pointer-events: none;
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 20px;
          opacity: 0;
          transform-origin: center;
          animation: fall 4s linear forwards;
        }
        @keyframes fall {
          0% {
            transform: translate(var(--initial-x), var(--initial-y)) rotate(var(--rotation));
            opacity: 1;
          }
          100% {
            transform: translate(calc(var(--initial-x) + ${Math.random() * 20 - 10}vw), 110vh) rotate(calc(var(--rotation) + 360deg));
            opacity: 0;
          }
        }
      `}</style>
      <div className="confetti-container">
        {pieces.map(p => (
          <ConfettiPiece key={p.id} {...p} />
        ))}
      </div>
    </>
  );
};

export default Confetti;
