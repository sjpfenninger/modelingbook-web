Math.sinh = function (arg) {
    return ((Math.exp(arg) - Math.exp(-arg))/2);
}

Math.cosh = function (arg) {
    return ((Math.exp(arg) + Math.exp(-arg))/2);
}

var lake = {};

lake.config = {
        workspaceID : 'lakecontainer',
};

lake.init = function () {
    tangle = lake.setupTangle();
    lake.setupBoards(tangle);
}

lake.setupTangle = function () {
    var tangleInitialized = false;
    var element = document.getElementById(lake.config.workspaceID);
    tangle = new Tangle(element, {
        initialize: function () {
            this.alpha = 2.0;
        },
        update: function () {
            if (tangleInitialized) {
                solution_board.fullUpdate()
            }
        },
    });
    tangleInitialized = true;
    return tangle;
};

lake.setupBoards = function (tangle) {
    JXG.Options = JXG.deepCopy(JXG.Options, {
        showNavigation: false,
        showCopyright: false,
        axis: {
            lastArrow: false,
        }
    });
    solution_board = JXG.JSXGraph.initBoard('solution_board', {boundingbox: [0, 1, 1, 0], axis: false, grid: false});

    // Disable mouse wheel scrolling
    JXG.removeEvent(solution_board.containerObj, 'mousewheel', solution_board.mouseWheelListener, solution_board);
    JXG.removeEvent(solution_board.containerObj, 'DOMMouseScroll', solution_board.mouseWheelListener, solution_board);
        
    // set up coordinates
    var z = Array.range(0.0, 1.0, 0.001);
    var z_o = Array.range(0.0, 0.5, 0.001); // upper half
    var z_u = Array.range(0.5, 1.0, 0.001); // lower half
        
    function drawcurves() {
        var alpha = tangle.getValue("alpha");
        var ca = [];
        var cb_o = [];
        var cb_u = [];
        var cc_o = [];
        var cc_u = [];
        var cd = [];
    
        // iterate through the z coordinates for each variable
        for (var i in z) {
            var istar = z.length - i;
            ca[i] = Math.cosh(alpha * (z[istar]-1))/Math.cosh(alpha);
            cd[i] = 1;
        }
        for (var i in z) {
            if (i >= 500) {
                var istar = z.length - i;
                cb_o[i] = 1 - alpha * (Math.sinh(alpha/2)/(Math.cosh(alpha/2)+(alpha/2)*Math.sinh(alpha/2))) * z_o[istar];
                cc_o[i] = Math.cosh(alpha*(z_o[istar]-0.5))/Math.cosh(alpha/2);
            }
        }
        for (var i in z_u) {
            var istar = z_u.length - i;
            cb_u[i] = Math.cosh(alpha*(z_u[istar]-1))/(Math.cosh(alpha/2)+(alpha/2)*Math.sinh(alpha/2));
            cc_u[i] = 1/Math.cosh(alpha/2);
        }
    
        // var curves = {'ca': ca, 'cb_o' : cb_o, 'cb_u' : cb_u, 'cc_o' : cc_o, 'cc_u' : cc_u, 'cd' : cd};
        var curves = [ca, cb_o, cb_u, cc_o, cc_u, cd];
        return curves;
    }
    
    var curves = drawcurves();
    lakecurves = [];
    var colors = ['#FDBE85', '#FD8D3C', '#FD8D3C', '#E6550D', '#E6550D', '#A63603'];
            
    for (var curve in curves) {
        lakecurves[curve] = solution_board.createElement('curve', [curves[curve], z], {strokeColor:colors[curve], strokeWidth:'2'});
        lakecurves[curve].curveid = curve;
        lakecurves[curve].updateDataArray = function() {
            var thecurves = drawcurves();
            this.dataX = [];
            this.dataY = [];
            for(var i=0; i<thecurves[this.curveid].length; i++) {
                this.dataX[i] = thecurves[this.curveid][i];
                this.dataY[i] = z[i];
            }
        }
    }
}