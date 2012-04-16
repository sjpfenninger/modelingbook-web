// Add Object.create()
// Source: Douglas Crockford
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

// Add Array.range()
// Source: http://stackoverflow.com/questions/3895478/does-javascript-have-a-range-equivalent
Array.range= function(a, b, step){
    var A= [];
    if(typeof a== 'number'){
        A[0]= a;
        step= step || 1;
        while(a+step<= b){
            A[A.length]= a+= step;
        }
    }
    else{
        var s= 'abcdefghijklmnopqrstuvwxyz';
        if(a=== a.toUpperCase()){
            b=b.toUpperCase();
            s= s.toUpperCase();
        }
        s= s.substring(s.indexOf(a), s.indexOf(b)+ 1);
        A= s.split('');        
    }
    return A;
}

require([
    "order!libraries/jquery-1.7.2.js",
    "order!libraries/jquery-ui-1.8.18.custom.min.js",
    "order!libraries/bootstrap-dropdown.js",
    "order!libraries/Tangle.js",
    "order!libraries/TangleKit/mootools.js",
    "order!libraries/TangleKit/sprintf.js",
    "order!libraries/TangleKit/BVTouchable.js",
    "order!libraries/TangleKit/TangleKit.js",
    "libraries/jquery.jsPlumb-1.3.8-all.js",
    "libraries/jsxgraphcore.js",
    "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
], function () {
    // $(document).ready(function(){
        // $('#topbar').dropdown();
    // });
});