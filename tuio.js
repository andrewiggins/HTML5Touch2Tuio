/*******************************************************************************
 * Name:        tuio.js
 * Purpose:     Creates TUIO events from the HTML5 Touch Events
 *
 * Author(s):   Andre Wiggins
 *
 * Created:     November 23, 2012
 * Copyright:   (c) Andre Wiggins 2012
 * License:
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE*2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 ******************************************************************************/

// This session id is used to identify this client in the TUIO source message
// This can be replaced by a server-assigned id
var session_id = Math.floor(Math.random() * 1000000);

var emitTuioEvent = (function emitTuioEventModule () {
    var fseq = 0,
        debug = true;

    function emitTuioEvent (e) {
        var tuiobundle = prepareTuioBundle(e);
    }

    function prepareTuioBundle (e) {
        var touches = e.touches;
        var targetTouches = e.targetTouches;
        var changedTouches = e.changedTouches;

        var source = 'tuio.js-'+session_id+'@webbrowser';

        var srcmsg = {address: '/tuio/2Dcur', values: ['source', source]};
        var alivemsg = {address: '/tuio/2Dcur', values: ['alive']};
        var fseqmsg = {address: '/tuio/2Dcur', values: ['fseq', fseq]};

        var setmsgs = [];
        for (var i = 0; i < touches.length; i++) {
            var newsetmsg = {address: '/tuio/2Dcur', values : []},
                touch = touches[i];

            alivemsg.values.push(touch.identifier);

            // Set Msg Format: /tuio/2Dcur set s x y X Y m t
            var s = touch.identifier; // s: session id - int32
            var x = touch.clientX; // x: x position - float32, range 0..1
            var y = touch.clientY; // y: y position - float32, range 0..1
            var X = 0.0; // X: x velocity vector - float32
            var Y = 0.0; // Y: y velocity vector - float32
            var m = 0.0; // m: motion acceleration - float32
            var t = touch.target; // t: Original DOM Element that finger first touched

            newsetmsg.values = ['set', s, x, y, X, Y, m, t];
            setmsgs.push(newsetmsg);
        }

        var bundle = []
        bundle.push(srcmsg);
        bundle.push(alivemsg);
        bundle = bundle.concat(setmsgs);
        bundle.push(fseqmsg);

        fseq += 1;

        if (debug) { console.log(event.type, bundle); }

        return bundle;
    }

    return emitTuioEvent;

})();

document.addEventListener('touchstart', emitTuioEvent, false);
document.addEventListener('touchmove', emitTuioEvent, false);
document.addEventListener('touchend', emitTuioEvent, false);
document.addEventListener('touchcancel', emitTuioEvent, false);

