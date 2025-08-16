import React from 'react';
import HelenLogo from '@/images/logo2025-hegen.png';

interface LogoProps {
  width?: number | string;
  height?: number | string;
}

const Logo: React.FC<LogoProps> = ({ width = '140', height = 100 }) => {
  return (
    <img src={HelenLogo.src} alt="Logo" width={width} className="self-center" />
  );
};

export default Logo;
