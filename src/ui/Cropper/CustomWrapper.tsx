import { type CSSProperties, type FC } from 'react';
import cn from 'classnames';
import { type CropperRef, CropperFade } from 'react-advanced-cropper';
import {
  getAbsoluteZoom,
  getZoomFactor
} from 'advanced-cropper/extensions/absolute-zoom';
import './CustomWrapper.scss';
import { Navigation } from '@/ui/Navigation/Navigation';

interface Props {
  cropper: CropperRef;
  loading: boolean;
  loaded: boolean;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export const CustomWrapper: FC<Props> = ({
  cropper,
  children,
  loaded,
  className
}) => {
  const state = cropper.getState();

  const settings = cropper.getSettings();

  const absoluteZoom = getAbsoluteZoom(state, settings);

  const onZoom = (value: number, transitions?: boolean) => {
    cropper.zoomImage(getZoomFactor(state, settings, value), {
      transitions: !!transitions
    });
  };
  return (
    <CropperFade
      className={cn('custom-wrapper', className)}
      visible={state && loaded}
    >
      {children}
      <Navigation
        className="custom-wrapper__navigation"
        zoom={absoluteZoom}
        onZoom={onZoom}
      />
    </CropperFade>
  );
};
