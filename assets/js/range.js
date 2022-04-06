/*
 * Plugin Name: Vanilla JSU Range
 * Version: 1.1.3
 * Plugin URL: https://github.com/JavaScriptUtilities/vanillaAnimateWords
 * JavaScriptUtilities Vanilla JSU Range may be freely distributed under the MIT license.
 */

function vanillaJsuRange($range) {
    'use strict';
    var draggedElement = false,
        innerStart,
        innerWidth,
        positions = [0, 0],
        rangeLevel,
        $inp = [],
        $thumbs = [],
        $track,
        $inner;

    if (!$range) {
        return false;
    }

    var _opt = {
        round: false,
        step: 1,
        min: 1,
        max: 100,
    };

    function init() {

        /* Avoid double init */
        if ($range.getAttribute('data-vanilla-jsu-range') == '1') {
            return;
        }

        /* Check inputs */
        $inp = [$range.querySelector('input[data-range-type="min"]'), $range.querySelector('input[data-range-type="max"]')];
        if (!$inp || !$inp[0] || !$inp[1]) {
            return;
        }

        /* Disallow a new init */
        $range.setAttribute('data-vanilla-jsu-range', 1);

        setOptions();
        setUpItems();
        setUpDragNDrop();
        setUpRefresh();
        setUpValues();
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
        rangeLevel = _opt.max - _opt.min;
    }

    function setUpItems() {

        /* Build elements */
        $thumbs = [document.createElement('BUTTON'), document.createElement('BUTTON')];
        $inner = document.createElement('DIV');
        $track = document.createElement('DIV');

        /* Add extra attributes */
        $thumbs[0].setAttribute('data-thumb', '1');
        $thumbs[0].setAttribute('type', 'button');
        $thumbs[1].setAttribute('data-thumb', '2');
        $thumbs[1].setAttribute('type', 'button');
        $track.setAttribute('data-track', '1');
        $inner.setAttribute('data-inner', '1');

        /* Insert elements */
        $inner.appendChild($track);
        $inner.appendChild($thumbs[0]);
        $inner.appendChild($thumbs[1]);
        $range.appendChild($inner);

        /* Force settings on number inputs */
        for (var i = 0; i <= 1; i++) {
            $inp[i].setAttribute('step', _opt.step);
            $inp[i].setAttribute('min', _opt.min);
            $inp[i].setAttribute('max', _opt.max);
        }
    }

    function setUpValues(_forceReset) {
        if (draggedElement) {
            return;
        }
        _forceReset = _forceReset ? _forceReset : false;

        /* Store initial values */
        var _values = [$inp[0].value, $inp[1].value];

        /* Store range positions */
        positions[0] = 0;
        positions[1] = rangeLevel;

        /* Setup basic input values */
        $inp[0].value = _opt.min;
        $inp[1].value = _opt.max;

        /* If initial values exists : position thumb & setup values */
        for (var i = 0; i <= 1; i++) {
            if (_values[i] && (_values[i] != $inp[i].value || _forceReset)) {
                setCursor(i, (parseInt(_values[i], 10) - _opt.min) / rangeLevel);
            }
        }
    }

    /* ----------------------------------------------------------
      Refresh events
    ---------------------------------------------------------- */

    function setUpRefresh() {
        $range.addEventListener('vanilla-jsu-range-refresh', function() {
            setUpValues(true);
        });

        for (var i = 0, len = $inp.length; i < len; i++) {
            $inp[i].addEventListener('change', setUpValues);
        }

    }

    /* ----------------------------------------------------------
      Dragndrop
    ---------------------------------------------------------- */

    function setUpDragNDrop() {
        $inner.addEventListener('touchstart', mousedown);
        document.addEventListener('touchmove', mousemove);
        document.addEventListener('touchend', mouseup);
        $inner.addEventListener('mousedown', mousedown);
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
    }

    /* Action when dragging starts */
    function mousedown(e) {
        if (!e.target.getAttribute('data-thumb')) {
            return;
        }
        draggedElement = e.target;
        innerStart = $inner.getBoundingClientRect().x;
        innerWidth = $inner.getBoundingClientRect().width;
    }

    /* Action when dragging */
    function mousemove(e) {
        if (!draggedElement) {
            return;
        }
        var
            /* Choosing which number is targeted */
            iEl = parseInt(draggedElement.getAttribute('data-thumb'), 10) - 1,
            /* Left position value */
            left = Math.min(innerWidth, Math.max(0, (e.clientX || e.touches[0].clientX) - innerStart)),
            leftPercent = left ? left / innerWidth : 0;

        setCursor(iEl, leftPercent);
    }

    /* Action when dragging stops */
    function mouseup() {
        if (draggedElement) {
            trigger_success_event();
        }
        draggedElement = false;
    }

    function trigger_success_event() {
        var e = new Event("vanilla-jsu-range-success");
        e.vanillajsurange = {
            min: parseInt($inp[0].value, 10),
            max: parseInt($inp[1].value, 10)
        };
        $range.dispatchEvent(e);
    }

    /* ----------------------------------------------------------
      Define range
    ---------------------------------------------------------- */

    function setCursor(iEl, leftPercent) {
        var rangePercent = rangeLevel * leftPercent;

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

        if (iEl === 0) {
            /* Too high ? */
            if (rangePercent >= positions[1]) {
                rangePercent = positions[1] - _opt.step;
            }
        }
        else {
            if (rangePercent <= positions[0]) {
                rangePercent = positions[0] + _opt.step;
            }
        }

        /* Store position */
        positions[iEl] = rangePercent;

        /* Convert percent to range again */
        leftPercent = rangePercent / rangeLevel * 100;

        /* Position thumb */
        $thumbs[iEl].style.left = leftPercent + '%';

        /* Position track */
        if (iEl === 0) {
            $track.style.left = leftPercent + '%';
        }
        $track.style.width = ((positions[1] - positions[0]) / rangeLevel * 100) + '%';

        /* Store value */
        $inp[iEl].value = _opt.min + rangePercent;
    }

    init();

}
