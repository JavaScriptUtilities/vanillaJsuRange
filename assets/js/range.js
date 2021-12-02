/*
 * Plugin Name: Vanilla JSU Range
 * Version: 0.1.0
 * Plugin URL: https://github.com/JavaScriptUtilities/vanillaAnimateWords
 * JavaScriptUtilities Vanilla JSU Range may be freely distributed under the MIT license.
 */

function vanillaJsuRange($range) {
    var draggedElement,
        innerStart,
        innerWidth,
        $inp = [],
        $thumb1,
        $thumb2,
        $inner;

    var _opt = {
        round: false,
        step: 1,
        min: 10,
        max: 100,
    };

    function init() {

        $inp = [$range.querySelector('input.min'), $range.querySelector('input.max')];

        if (!$inp || !$inp[0] || !$inp[1]) {
            return;
        }

        setOptions();
        setUpItems();
        setUpDragNDrop();
    }

    function setOptions() {
        if ($range.getAttribute('data-min')) {
            _opt.min = parseInt($range.getAttribute('data-min'), 10);
        }
        if ($range.getAttribute('data-max')) {
            _opt.max = parseInt($range.getAttribute('data-max'), 10);
        }
        if ($range.getAttribute('data-step')) {
            _opt.step = parseInt($range.getAttribute('data-step'), 10);
        }
        if ($range.getAttribute('data-round') && $range.getAttribute('data-round')) {
            _opt.round = true;
        }

        /* Setup number values */
        $inp[0].value = _opt.min;
        $inp[1].value = _opt.max;
    }

    function setUpItems() {

        /* Build elements */
        $thumb1 = document.createElement('BUTTON');
        $thumb2 = document.createElement('BUTTON');
        $inner = document.createElement('DIV');

        /* Add extra attributes */
        $thumb1.setAttribute('data-thumb', '1');
        $thumb2.setAttribute('data-thumb', '2');
        $inner.setAttribute('data-inner', '1');

        /* Insert elements */
        $range.appendChild($inner);
        $inner.appendChild($thumb1);
        $inner.appendChild($thumb2);
    }

    function setUpDragNDrop() {
        $inner.addEventListener('touchstart', mousedown)
        document.addEventListener('touchmove', mousemove);
        document.addEventListener('touchend', mouseup)
        $inner.addEventListener('mousedown', mousedown)
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    }

    /* Action when dragging starts */
    function mousedown(e) {
        draggedElement = e.target;
        innerStart = $inner.getBoundingClientRect().x;
        innerWidth = $inner.getBoundingClientRect().width;
    }

    /* Action when dragging */
    function mousemove(e) {
        if (!draggedElement) {
            return;
        }
        var rangePercent = 0,
            rangeLevel = _opt.max - _opt.min,
            /* Choosing which number is targeted */
            iEl = parseInt(draggedElement.getAttribute('data-thumb'), 10) - 1,
            /* Left position value */
            left = Math.min(innerWidth, Math.max(0, e.clientX - innerStart)),
            leftPercent = left ? left / innerWidth : 0,
            /* Percent of range */
            rangePercent = rangeLevel * leftPercent;

        /* Rounding if necessary */
        if (_opt.round || _opt.step > 1) {

            if (_opt.step > 1) {
                rangePercent = rangePercent / _opt.step;
            }
            rangePercent = Math.round(rangePercent, 0);
            if (_opt.step > 1) {
                rangePercent = rangePercent * _opt.step;
            }
        }

        /* Convert percent to range again */
        leftPercent = rangePercent / rangeLevel * 100;

        /* Position thumb */
        draggedElement.style.left = leftPercent + '%';

        /* Store value */
        $inp[iEl].value = _opt.min + rangePercent;
    }

    /* Action when dragging stops */
    function mouseup() {
        draggedElement = false;
    }

    init();

}
