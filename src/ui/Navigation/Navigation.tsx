import { type FC } from 'react';
import cn from 'classnames';
import { isNumber } from 'advanced-cropper';
import { Slider } from '../Slider/Slider';
import { BiZoomIn, BiZoomOut } from 'react-icons/bi';
import './Navigation.scss';

interface Props {
  zoom?: number;
  onZoom?: (value: number, transitions?: boolean) => void;
  className?: string;
  disabled?: unknown;
}

export const Navigation: FC<Props> = ({ className, onZoom, zoom }) => {
  const onZoomIn = () => {
    if (onZoom && isNumber(zoom)) {
      onZoom(Math.min(1, zoom + 0.25), true);
    }
  };

  const onZoomOut = () => {
    if (onZoom && isNumber(zoom)) {
      onZoom(Math.max(0, zoom - 0.25), true);
    }
  };

  return (
    <div className={cn('absolute-zoom-cropper-navigation', className)}>
      <button
        className="absolute-zoom-cropper-navigation__button"
        onClick={onZoomOut}
      >
        <BiZoomOut />
      </button>
      <Slider
        value={zoom}
        onChange={onZoom}
        className="absolute-zoom-cropper-navigation__slider"
      />
      <button
        className="absolute-zoom-cropper-navigation__button"
        onClick={onZoomIn}
      >
        <BiZoomIn />
      </button>
    </div>
  );
};
