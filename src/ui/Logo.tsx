import React from 'react';
import HelenLogo from '@/images/hegen-fondosclaros.png';

interface LogoProps {
  width?: number | string;
  height?: number | string;
}

const Logo: React.FC<LogoProps> = ({ width = '150', height = 100 }) => {
  return (
    <img src={HelenLogo.src} alt="Logo" width={width} className="self-center" />
  );
};

export default Logo;
