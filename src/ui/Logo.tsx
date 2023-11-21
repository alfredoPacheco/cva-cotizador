import React from 'react';
import LogoSvg from '../images/logo.svg';

interface LogoProps {
  width?: number | string;
  height?: number | string;
}

const Logo: React.FC<LogoProps> = ({ width = '150', height = 100 }) => {
  return (
    <img src={LogoSvg.src} alt="Logo" width={width} className="self-center" />
  );
};

export default Logo;
