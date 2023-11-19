import React from 'react';
import LogoSvg from '../images/logo.svg';

interface LogoProps {
  width?: number | string;
  height?: number | string;
}

const Logo: React.FC<LogoProps> = ({ width = 100, height = 100 }) => {
  return <img src={LogoSvg.src} alt="Logo" width="150" />;
};

export default Logo;
