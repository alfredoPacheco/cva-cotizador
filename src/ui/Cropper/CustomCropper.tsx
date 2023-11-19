import 'react-advanced-cropper/dist/style.css';
// import 'react-advanced-cropper/dist/themes/corners.css';
// import 'react-advanced-cropper/dist/themes/classic.css';
// import 'react-advanced-cropper/dist/themes/compact.css';
// import 'react-advanced-cropper/dist/themes/bubble.css';

import { CustomWrapper } from '@/ui/Cropper/CustomWrapper';
import { forwardRef } from 'react';
import {
  ImageRestriction,
  FixedCropper,
  type FixedCropperRef,
  type FixedCropperProps
} from 'react-advanced-cropper';

export type CustomCropperProps = FixedCropperProps;

export type CustomCropperRef = FixedCropperRef;

export const CustomCropper = forwardRef<CustomCropperRef, CustomCropperProps>(
  ({ stencilProps, ...props }: CustomCropperProps, ref) => {
    return (
      <FixedCropper
        ref={ref}
        stencilProps={{
          handlers: false,
          lines: false,
          movable: false,
          resizable: false,
          ...stencilProps
        }}
        imageRestriction={ImageRestriction.stencil}
        wrapperComponent={CustomWrapper}
        {...props}
      />
    );
  }
);

CustomCropper.displayName = 'CustomCropper';
