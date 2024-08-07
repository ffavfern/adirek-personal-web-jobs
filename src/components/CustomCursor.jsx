import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  const onMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const onMouseEnter = () => {
    setCursorVariant('hover');
  };

  const onMouseLeave = () => {
    setCursorVariant('default');
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    const hoverables = document.querySelectorAll('.hoverable');

    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  const cursorStyles = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <div className={`custom-cursor ${cursorVariant}`} style={cursorStyles}></div>
  );
};

export default CustomCursor;
