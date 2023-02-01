import React from 'react';
import type { Ref } from './types';
declare const PrismaZoom: React.ForwardRefExoticComponent<{
    children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement> & {
    minZoom?: number | undefined;
    maxZoom?: number | undefined;
    initialZoom?: number | undefined;
    scrollVelocity?: number | undefined;
    onZoomChange?: ((zoom: number) => void) | undefined;
    onPanChange?: ((props: {
        posX: number;
        posY: number;
    }) => void) | undefined;
    animDuration?: number | undefined;
    doubleTouchMaxDelay?: number | undefined;
    decelerationDuration?: number | undefined;
    allowZoom?: boolean | undefined;
    allowPan?: boolean | undefined;
    allowTouchEvents?: boolean | undefined;
    allowParentPanning?: boolean | undefined;
    allowWheel?: boolean | undefined;
} & React.RefAttributes<Ref>>;
export default PrismaZoom;
