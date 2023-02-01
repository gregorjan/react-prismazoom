var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
// Transform translateX ans translateY value property
var defaultPos = [0, 0];
// Cursor style property
var defaultCursor = 'auto';
var PrismaZoom = forwardRef(function (props, forwardedRef) {
    var children = props.children, onPanChange = props.onPanChange, onZoomChange = props.onZoomChange, _a = props.minZoom, minZoom = _a === void 0 ? 1 : _a, _b = props.initialZoom, initialZoom = _b === void 0 ? 1 : _b, _c = props.maxZoom, maxZoom = _c === void 0 ? 5 : _c, _d = props.scrollVelocity, scrollVelocity = _d === void 0 ? 0.2 : _d, _e = props.animDuration, animDuration = _e === void 0 ? 0.25 : _e, _f = props.doubleTouchMaxDelay, doubleTouchMaxDelay = _f === void 0 ? 300 : _f, _g = props.decelerationDuration, decelerationDuration = _g === void 0 ? 750 : _g, _h = props.allowZoom, allowZoom = _h === void 0 ? true : _h, _j = props.allowPan, allowPan = _j === void 0 ? true : _j, _k = props.allowTouchEvents, allowTouchEvents = _k === void 0 ? false : _k, _l = props.allowParentPanning, allowParentPanning = _l === void 0 ? false : _l, _m = props.allowWheel, allowWheel = _m === void 0 ? true : _m, divProps = __rest(props
    // Reference to the main element
    , ["children", "onPanChange", "onZoomChange", "minZoom", "initialZoom", "maxZoom", "scrollVelocity", "animDuration", "doubleTouchMaxDelay", "decelerationDuration", "allowZoom", "allowPan", "allowTouchEvents", "allowParentPanning", "allowWheel"]);
    // Reference to the main element
    var ref = useRef(null);
    // Last request animation frame identifier
    var lastRequestAnimationIdRef = useRef();
    // Last touch time in milliseconds
    var lastTouchTimeRef = useRef();
    // Last double tap time (used to limit multiple double tap) in milliseconds
    var lastDoubleTapTimeRef = useRef();
    // Last shifted position
    var lastShiftRef = useRef();
    // Last calculated distance between two fingers in pixels
    var lastTouchDistanceRef = useRef();
    // Last cursor position
    var lastCursorRef = useRef();
    // Last touch position
    var lastTouchRef = useRef();
    // Current zoom level
    var zoomRef = useRef(initialZoom);
    // Current position
    var posRef = useRef(defaultPos);
    // Current transition duration
    var transitionRef = useRef(animDuration);
    var _o = useState(defaultCursor), cursor = _o[0], setCursor = _o[1];
    var update = function () {
        if (!ref.current)
            return;
        ref.current.style.transition = "transform ease-out ".concat(transitionRef.current, "s");
        ref.current.style.transform = "translate3d(".concat(posRef.current[0], "px, ").concat(posRef.current[1], "px, 0) scale(").concat(zoomRef.current, ")");
    };
    var setZoom = function (zoom) {
        zoomRef.current = zoom;
        update();
        if (onZoomChange) {
            onZoomChange(zoom);
        }
    };
    var setPos = function (pos) {
        posRef.current = pos;
        update();
        if (onPanChange) {
            onPanChange({ posX: pos[0], posY: pos[1] });
        }
    };
    var setTransitionDuration = function (duration) {
        transitionRef.current = duration;
        update();
    };
    // Imperative Ref methods
    useImperativeHandle(forwardedRef, function () { return ({
        getZoom: getZoom,
        zoomIn: zoomIn,
        reset: reset,
        zoomOut: zoomOut,
        zoomToZone: zoomToZone,
    }); });
    /**
     * Returns the current zoom value.
     * @return {Number} Zoom value
     */
    var getZoom = function () { return zoomRef.current; };
    /**
     * Increments the zoom with the given value.
     * @param  {Number} value Zoom value
     */
    var zoomIn = function (value) {
        var newPosX = posRef.current[0];
        var newPosY = posRef.current[1];
        var prevZoom = zoomRef.current;
        var newZoom = prevZoom + value < maxZoom ? prevZoom + value : maxZoom;
        if (newZoom !== prevZoom) {
            newPosX = (newPosX * (newZoom - 1)) / (prevZoom > 1 ? prevZoom - 1 : prevZoom);
            newPosY = (newPosY * (newZoom - 1)) / (prevZoom > 1 ? prevZoom - 1 : prevZoom);
        }
        setZoom(newZoom);
        setPos([newPosX, newPosY]);
        setTransitionDuration(animDuration);
    };
    /**
     * Decrements the zoom with the given value.
     * @param  {Number} value Zoom value
     */
    var zoomOut = function (value) {
        var newPosX = posRef.current[0];
        var newPosY = posRef.current[1];
        var prevZoom = zoomRef.current;
        var newZoom = prevZoom - value > minZoom ? prevZoom - value : minZoom;
        if (newZoom !== prevZoom) {
            newPosX = (newPosX * (newZoom - 1)) / (prevZoom - 1);
            newPosY = (newPosY * (newZoom - 1)) / (prevZoom - 1);
        }
        setZoom(newZoom);
        setPos([newPosX, newPosY]);
        setTransitionDuration(animDuration);
    };
    /**
     * Zoom-in on the specified zone with the given relative coordinates and dimensions.
     * @param  {Number} relX      Relative X position of the zone left-top corner in pixels
     * @param  {Number} relY      Relative Y position of the zone left-top corner in pixels
     * @param  {Number} relWidth  Zone width in pixels
     * @param  {Number} relHeight Zone height in pixels
     */
    var zoomToZone = function (relX, relY, relWidth, relHeight) {
        var _a;
        if (!ref.current)
            return;
        var newPosX = posRef.current[0];
        var newPosY = posRef.current[1];
        var parentRect = ((_a = ref.current) === null || _a === void 0 ? void 0 : _a.parentNode).getBoundingClientRect();
        var prevZoom = zoomRef.current;
        // Calculate zoom factor to scale the zone
        var optimalZoomX = parentRect.width / relWidth;
        var optimalZoomY = parentRect.height / relHeight;
        var newZoom = Math.min(optimalZoomX, optimalZoomY, maxZoom);
        // Calculate new position to center the zone
        var rect = ref.current.getBoundingClientRect();
        var _b = [rect.width / prevZoom / 2, rect.height / prevZoom / 2], centerX = _b[0], centerY = _b[1];
        var _c = [relX + relWidth / 2, relY + relHeight / 2], zoneCenterX = _c[0], zoneCenterY = _c[1];
        newPosX = (centerX - zoneCenterX) * newZoom;
        newPosY = (centerY - zoneCenterY) * newZoom;
        setZoom(newZoom);
        setPos([newPosX, newPosY]);
        setTransitionDuration(animDuration);
    };
    /**
     * Calculates new translate positions for CSS transformations.
     * @param  {Number} x     Relative (rect-based) X position in pixels
     * @param  {Number} y     Relative (rect-based) Y position in pixels
     * @param  {Number} zoom  Scale value
     * @return {Array}        New X and Y positions
     */
    var getNewPosition = function (x, y, newZoom) {
        var _a = [zoomRef.current, posRef.current[0], posRef.current[1]], prevZoom = _a[0], prevPosX = _a[1], prevPosY = _a[2];
        if (newZoom === 1 || !ref.current)
            return [0, 0];
        if (newZoom > prevZoom) {
            // Get container coordinates
            var rect = ref.current.getBoundingClientRect();
            // Retrieve rectangle dimensions and mouse position
            var _b = [rect.width / 2, rect.height / 2], centerX = _b[0], centerY = _b[1];
            var _c = [x - rect.left - window.pageXOffset, y - rect.top - window.pageYOffset], relativeX = _c[0], relativeY = _c[1];
            // If we are zooming down, we must try to center to mouse position
            var _d = [(centerX - relativeX) / prevZoom, (centerY - relativeY) / prevZoom], absX = _d[0], absY = _d[1];
            var ratio = newZoom - prevZoom;
            return [prevPosX + absX * ratio, prevPosY + absY * ratio];
        }
        else {
            // If we are zooming down, we shall re-center the element
            return [(prevPosX * (newZoom - 1)) / (prevZoom - 1), (prevPosY * (newZoom - 1)) / (prevZoom - 1)];
        }
    };
    /**
     * Applies a full-zoom on the specified X and Y positions
     * @param  {Number} x Relative (rect-based) X position in pixels
     * @param  {Number} y Relative (rect-based) Y position in pixels
     */
    var fullZoomInOnPosition = function (x, y) {
        var zoom = maxZoom;
        setZoom(zoom);
        setPos(getNewPosition(x, y, zoom));
        setTransitionDuration(animDuration);
    };
    /**
     * Moves the element by incrementing its position with given X and Y values.
     * @param  {Number} shiftX             Position change to apply on X axis in pixels
     * @param  {Number} shiftY             Position change to apply on Y axis in pixels
     * @param  {Number} transitionDuration Transition duration (in seconds)
     */
    var move = function (shiftX, shiftY, transitionDuration) {
        if (transitionDuration === void 0) { transitionDuration = 0; }
        if (!ref.current)
            return;
        var newPosX = posRef.current[0];
        var newPosY = posRef.current[1];
        // Get container and container's parent coordinates
        var rect = ref.current.getBoundingClientRect();
        var parentRect = ref.current.parentNode.getBoundingClientRect();
        var _a = [
            // Check if the element is larger than its container
            rect.width > parentRect.right - parentRect.left,
            // Check if the element is out its container left boundary
            shiftX > 0 && rect.left - parentRect.left < 0,
            // Check if the element is out its container right boundary
            shiftX < 0 && rect.right - parentRect.right > 0,
        ], isLarger = _a[0], isOutLeftBoundary = _a[1], isOutRightBoundary = _a[2];
        var canMoveOnX = isLarger || isOutLeftBoundary || isOutRightBoundary;
        if (canMoveOnX) {
            newPosX += getLimitedShift(shiftX, parentRect.left, parentRect.right, rect.left, rect.right);
        }
        var _b = [
            // Check if the element is higher than its container
            rect.height > parentRect.bottom - parentRect.top,
            // Check if the element is out its container top boundary
            shiftY > 0 && rect.top - parentRect.top < 0,
            // Check if the element is out its container bottom boundary
            shiftY < 0 && rect.bottom - parentRect.bottom > 0,
        ], isHigher = _b[0], isOutTopBoundary = _b[1], isOutBottomBoundary = _b[2];
        var canMoveOnY = isHigher || isOutTopBoundary || isOutBottomBoundary;
        if (canMoveOnY) {
            newPosY += getLimitedShift(shiftY, parentRect.top, parentRect.bottom, rect.top, rect.bottom);
        }
        var cursor = getCursor(canMoveOnX, canMoveOnY);
        setPos([newPosX, newPosY]);
        setCursor(cursor);
        setTransitionDuration(transitionDuration);
    };
    /**
     * Check if the user is doing a double tap gesture.
     * @return {Boolean} Result of the checking
     */
    var isDoubleTapping = function () {
        var _a, _b;
        var touchTime = new Date().getTime();
        var isDoubleTap = touchTime - ((_a = lastTouchTimeRef.current) !== null && _a !== void 0 ? _a : 0) < doubleTouchMaxDelay &&
            touchTime - ((_b = lastDoubleTapTimeRef.current) !== null && _b !== void 0 ? _b : 0) > doubleTouchMaxDelay;
        if (isDoubleTap) {
            lastDoubleTapTimeRef.current = touchTime;
            return true;
        }
        lastTouchTimeRef.current = touchTime;
        return false;
    };
    /**
     * Calculates the narrowed shift for panning actions.
     * @param  {Number} shift      Initial shift in pixels
     * @param  {Number} minLimit   Minimum limit (left or top) in pixels
     * @param  {Number} maxLimit   Maximum limit (right or bottom) in pixels
     * @param  {Number} minElement Left or top element position in pixels
     * @param  {Number} maxElement Right or bottom element position in pixels
     * @return {Number}            Narrowed shift
     */
    var getLimitedShift = function (shift, minLimit, maxLimit, minElement, maxElement) {
        if (shift > 0) {
            if (minElement > minLimit) {
                // Forbid move if we are moving to left or top while we are already out minimum boudaries
                return 0;
            }
            else if (minElement + shift > minLimit) {
                // Lower the shift if we are going out boundaries
                return minLimit - minElement;
            }
        }
        else if (shift < 0) {
            if (maxElement < maxLimit) {
                // Forbid move if we are moving to right or bottom while we are already out maximum boudaries
                return 0;
            }
            else if (maxElement + shift < maxLimit) {
                // Lower the shift if we are going out boundaries
                return maxLimit - maxElement;
            }
        }
        return shift;
    };
    var getCursor = function (canMoveOnX, canMoveOnY) {
        if (canMoveOnX && canMoveOnY) {
            return 'move';
        }
        else if (canMoveOnX) {
            return 'ew-resize';
        }
        else if (canMoveOnY) {
            return 'ns-resize';
        }
        else {
            return 'auto';
        }
    };
    /**
     * Trigger a decelerating movement after a mouse up or a touch end event, using the last movement shift.
     * @param  {Number} lastShiftOnX Last shift on the X axis in pixels
     * @param  {Number} lastShiftOnY Last shift on the Y axis in pixels
     */
    var startDeceleration = function (lastShiftOnX, lastShiftOnY) {
        var startTimestamp = null;
        var startDecelerationMove = function (timestamp) {
            if (startTimestamp === null)
                startTimestamp = timestamp;
            var progress = timestamp - startTimestamp;
            // Calculates the ratio to apply on the move (used to create a non-linear deceleration)
            var ratio = (decelerationDuration - progress) / decelerationDuration;
            var _a = [lastShiftOnX * ratio, lastShiftOnY * ratio], shiftX = _a[0], shiftY = _a[1];
            // Continue animation only if time has not expired and if there is still some movement (more than 1 pixel on one axis)
            if (progress < decelerationDuration && Math.max(Math.abs(shiftX), Math.abs(shiftY)) > 1) {
                move(shiftX, shiftY, 0);
                lastRequestAnimationIdRef.current = requestAnimationFrame(startDecelerationMove);
            }
            else {
                lastRequestAnimationIdRef.current = null;
            }
        };
        lastRequestAnimationIdRef.current = requestAnimationFrame(startDecelerationMove);
    };
    /**
     * Resets the component to its initial state.
     */
    var reset = function () {
        setZoom(initialZoom);
        setCursor(defaultCursor);
        setTransitionDuration(animDuration);
        setPos(defaultPos);
    };
    /**
     * Event handler on double click.
     * @param  {MouseEvent} event Mouse event
     */
    var handleDoubleClick = function (event) {
        event.preventDefault();
        if (!allowZoom)
            return;
        if (zoomRef.current === minZoom) {
            fullZoomInOnPosition(event.pageX, event.pageY);
        }
        else {
            reset();
        }
    };
    /**
     * Event handler on scroll.
     * @param  {MouseEvent} event Mouse event
     */
    var handleMouseWheel = function (event) {
        event.preventDefault();
        if (!allowZoom || !allowWheel)
            return;
        // Use the scroll event delta to determine the zoom velocity
        var velocity = (-event.deltaY * scrollVelocity) / 100;
        // Set the new zoom level
        var newZoom = Math.max(Math.min(zoomRef.current + velocity, maxZoom), minZoom);
        var newPosition = posRef.current;
        if (newZoom !== zoomRef.current) {
            newPosition = newZoom !== minZoom ? getNewPosition(event.pageX, event.pageY, newZoom) : defaultPos;
        }
        setZoom(newZoom);
        setPos(newPosition);
        setTransitionDuration(0.05);
    };
    /**
     * Event handler on mouse down.
     * @param  {MouseEvent} event Mouse event
     */
    var handleMouseStart = function (event) {
        event.preventDefault();
        if (!allowPan)
            return;
        if (lastRequestAnimationIdRef.current)
            cancelAnimationFrame(lastRequestAnimationIdRef.current);
        lastCursorRef.current = [event.pageX, event.pageY];
    };
    /**
     * Event handler on mouse move.
     * @param  {MouseEvent} event Mouse event
     */
    var handleMouseMove = function (event) {
        event.preventDefault();
        if (!allowPan || !lastCursorRef.current)
            return;
        var _a = [event.pageX, event.pageY], posX = _a[0], posY = _a[1];
        var shiftX = posX - lastCursorRef.current[0];
        var shiftY = posY - lastCursorRef.current[1];
        move(shiftX, shiftY, 0);
        lastCursorRef.current = [posX, posY];
        lastShiftRef.current = [shiftX, shiftY];
    };
    /**
     * Event handler on mouse up or mouse out.
     * @param  {MouseEvent} event Mouse event
     */
    var handleMouseStop = function (event) {
        event.preventDefault();
        if (lastShiftRef.current) {
            // Use the last shift to make a decelerating movement effect
            startDeceleration(lastShiftRef.current[0], lastShiftRef.current[1]);
            lastShiftRef.current = null;
        }
        lastCursorRef.current = null;
        setCursor('auto');
    };
    /**
     * Event handler on touch start.
     * Zoom-in at the maximum scale if a double tap is detected.
     * @param  {TouchEvent} event Touch event
     */
    var handleTouchStart = function (event) {
        var isThisDoubleTapping = isDoubleTapping();
        var isMultiTouch = event.touches.length > 1;
        if (!allowTouchEvents)
            event.preventDefault();
        if (lastRequestAnimationIdRef.current)
            cancelAnimationFrame(lastRequestAnimationIdRef.current);
        var _a = [event.touches[0].pageX, event.touches[0].pageY], posX = _a[0], posY = _a[1];
        if (isMultiTouch) {
            lastTouchRef.current = [posX, posY];
            return;
        }
        if (isThisDoubleTapping && allowZoom) {
            if (zoomRef.current === minZoom) {
                fullZoomInOnPosition(posX, posY);
            }
            else {
                reset();
            }
            return;
        }
        // Don't save the last touch if we are starting a simple touch move while panning is disabled
        if (allowPan)
            lastTouchRef.current = [posX, posY];
    };
    /**
     * Event handler on touch move.
     * Either move the element using one finger or zoom-in with a two finger pinch.
     * @param  {TouchEvent} event Touch move
     */
    var handleTouchMove = function (event) {
        if (!allowTouchEvents)
            event.preventDefault();
        if (!lastTouchRef.current)
            return;
        if (event.touches.length === 1) {
            var _a = [event.touches[0].pageX, event.touches[0].pageY], posX = _a[0], posY = _a[1];
            // If we detect only one point, we shall just move the element
            var shiftX = posX - lastTouchRef.current[0];
            var shiftY = posY - lastTouchRef.current[1];
            move(shiftX, shiftY);
            lastShiftRef.current = [shiftX, shiftY];
            // Save data for the next move
            lastTouchRef.current = [posX, posY];
            lastTouchDistanceRef.current = null;
        }
        else if (event.touches.length > 1) {
            var newZoom = zoomRef.current;
            // If we detect two points, we shall zoom up or down
            var _b = [event.touches[0].pageX, event.touches[0].pageY], pos1X = _b[0], pos1Y = _b[1];
            var _c = [event.touches[1].pageX, event.touches[1].pageY], pos2X = _c[0], pos2Y = _c[1];
            var distance = Math.sqrt(Math.pow(pos2X - pos1X, 2) + Math.pow(pos2Y - pos1Y, 2));
            if (lastTouchDistanceRef.current && distance && distance !== lastTouchDistanceRef.current) {
                if (allowZoom) {
                    newZoom += (distance - lastTouchDistanceRef.current) / 100;
                    if (newZoom > maxZoom) {
                        newZoom = maxZoom;
                    }
                    else if (newZoom < minZoom) {
                        newZoom = minZoom;
                    }
                }
                // Change position using the center point between the two fingers
                var _d = [(pos1X + pos2X) / 2, (pos1Y + pos2Y) / 2], centerX = _d[0], centerY = _d[1];
                var newPos = getNewPosition(centerX, centerY, newZoom);
                setZoom(newZoom);
                setPos(newPos);
                setTransitionDuration(0);
            }
            // Save data for the next move
            lastTouchRef.current = [pos1X, pos1Y];
            lastTouchDistanceRef.current = distance;
        }
    };
    /**
     * Event handler on touch end or touch cancel.
     * @param  {TouchEvent} event Touch move
     */
    var handleTouchStop = function () {
        if (lastShiftRef.current) {
            // Use the last shift to make a decelerating movement effect
            startDeceleration(lastShiftRef.current[0], lastShiftRef.current[1]);
            lastShiftRef.current = null;
        }
        lastTouchRef.current = null;
        lastTouchDistanceRef.current = null;
    };
    useEffect(function () {
        var refCurrentValue = ref.current;
        var hasMouseDevice = window.matchMedia('(pointer: fine)').matches;
        refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('wheel', handleMouseWheel, { passive: false });
        if (hasMouseDevice) {
            // Apply mouse events only to devices which include an accurate pointing device
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('mousedown', handleMouseStart, { passive: false });
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('mousemove', handleMouseMove, { passive: false });
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('mouseup', handleMouseStop, { passive: false });
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('mouseleave', handleMouseStop, { passive: false });
        }
        else {
            // Apply touch events to all other devices
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('touchstart', handleTouchStart, { passive: false });
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('touchmove', handleTouchMove, { passive: false });
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('touchend', handleTouchStop, { passive: false });
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.addEventListener('touchcancel', handleTouchStop, { passive: false });
        }
        return function () {
            refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('wheel', handleMouseWheel);
            if (hasMouseDevice) {
                refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('mousedown', handleMouseStart);
                refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('mousemove', handleMouseMove);
                refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('mouseup', handleMouseStop);
                refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('mouseleave', handleMouseStop);
            }
            else {
                refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('touchstart', handleTouchStart);
                refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('touchmove', handleTouchMove);
                refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('touchend', handleTouchStop);
                refCurrentValue === null || refCurrentValue === void 0 ? void 0 : refCurrentValue.removeEventListener('touchcancel', handleTouchStop);
            }
        };
    }, []);
    var attr = __assign(__assign({}, divProps), { ref: ref, onDoubleClick: handleDoubleClick, style: __assign(__assign({}, divProps.style), { cursor: cursor, willChange: 'transform', transition: "transform ease-out ".concat(transitionRef.current, "s"), touchAction: allowParentPanning && zoomRef.current === 1 ? 'pan-x pan-y' : 'none', transform: "translate3d(".concat(posRef.current[0], "px, ").concat(posRef.current[1], "px, 0) scale(").concat(zoomRef.current, ")") }) });
    return _jsx("div", __assign({}, attr, { children: children }));
});
export default PrismaZoom;
