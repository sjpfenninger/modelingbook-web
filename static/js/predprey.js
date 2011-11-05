function setUpTangle() {

	var initialized = false;

	var element = document.getElementById("predprey_settings");

    var tangle = new Tangle(element, {
        initialize: function () {
            this.k1 = 0.5;
            this.k2 = 0.8;
			this.k3 = 0.008;
			this.alpha = 1.0;
			this.k4 = 0;
			this.X0 = 50;
			this.Y0 = 30;
        },
        update: function () {
			if (initialized) {
				startprey.moveTo([0,this.X0],10);
				startpred.moveTo([0,this.Y0],10);
				predprey_board.fullUpdate() // phase_board is a dependent child, no need to fullUpdate it
			}
			if (this.k4 > 0) {
				$("span#k4_container").removeClass("var_inactive");
			} else {
				$("span#k4_container").addClass("var_inactive");
			}
			this.epsilon = (this.k4 * this.k2) / this.k3
			this.Xinf = this.k2 / (this.k3 * this.alpha);
			this.Yinf = (this.k1 - this.epsilon) / this.k3;
			this.p11 = this.epsilon - (2 * this.epsilon * (1/this.alpha));
			this.trace = this.p11;
			this.det = (-1) * (-this.k2/this.alpha) * (this.k1-this.epsilon);
			this.disc = Math.pow(this.trace,2) - 4*this.det;
			if (this.trace == 0 && this.disc < 0) {
				this.stability = '<span style="color: green;">undamped oscillation</span>';
			} else if (this.trace < 0 && this.disc < 0) {
				this.stability = '<span style="color: red;">damped oscillation</span>';
			} else if (this.trace > 0 && this.disc < 0) {
				this.stability = '<span style="color: yellow;">oscillation growing to infinity</spam>';
			} else {
				this.stability = '--no oscillation--'
			}
        }
    });

	// Set up the drawing boards
	JXG.Options = JXG.deepCopy(JXG.Options, {
	    showNavigation: false,
		showCopyright: false,
		axis: {
			lastArrow: false,
		}
	}
	);
	predprey_board = JXG.JSXGraph.initBoard('predprey_board', {boundingbox: [-1.5, 302.5, 77.5, -20.5], axis: true, grid: false});
	JXG.Options.axis.ticks.drawLabels = false;
	phase_board = JXG.JSXGraph.initBoard('phase_board', {boundingbox: [-1.5, 302.5, 302.5, -20.5], axis: true, grid: false});
	predprey_board.addChild(phase_board);
		
	// Disable mouse wheel scrolling
	JXG.removeEvent(predprey_board.containerObj, 'mousewheel', predprey_board.mouseWheelListener,
	predprey_board);
	JXG.removeEvent(predprey_board.containerObj, 'DOMMouseScroll',
	predprey_board.mouseWheelListener, predprey_board);
	JXG.removeEvent(phase_board.containerObj, 'mousewheel', phase_board.mouseWheelListener,
	phase_board);
	JXG.removeEvent(phase_board.containerObj, 'DOMMouseScroll',
	phase_board.mouseWheelListener, phase_board);
	
	// Set colors
	var preycolor = '#91BFDB'
	var predcolor = '#FC8D59'
	var phasecolor = '#31A354'

    // Dynamic initial value as gliders on the y-axis
    startprey = predprey_board.createElement('glider', [0, 50, predprey_board.defaultAxes.y], {name:'X: Prey',strokeColor:preycolor,fillColor:preycolor});
	startpred = predprey_board.createElement('glider', [0, 30, predprey_board.defaultAxes.y], {name:'Y: Predators',strokeColor:predcolor,fillColor:predcolor});
	predprey_board.addHook(function() {
		tangle.setValue("X0", startprey.Y());
		tangle.setValue("Y0", startpred.Y());
	})
	
	// Variables for the JXG.Curves
    var preycurve = null;
    var predcurve = null;
	var phasecurve = null;


    // Initialise ODE and solve it with JXG.Math.Numerics.rungeKutta()
    function ode() {
        // evaluation interval
        var I = [0, 75];
        // Number of steps. 1000 should be enough
        var N = 1000;

		var k1 = tangle.getValue("k1");
        var k2 = tangle.getValue("k2");
        var k3 = tangle.getValue("k3");
        var alpha = tangle.getValue("alpha");
		var k4 = tangle.getValue("k4");

        // Right hand side of the ODE dx/dt = f(t, x)
        var f = function(t, x) {
            var y = [];
            y[0] = k1*x[0] - k3*x[0]*x[1] -k4*x[0]*x[0];
            y[1] = -k2*x[1] + alpha*k3*x[0]*x[1];

            return y;
        }

        // Initial value
        var x0 = [startprey.Y(), startpred.Y()];

        // Solve ode
        var data = JXG.Math.Numerics.rungeKutta('heun', x0, I, N, f);

        // to plot the data against time we need the times where the equations were solved
        var t = [];
        var q = I[0];
        var h = (I[1]-I[0])/N;
        for(var i=0; i<data.length; i++) {
            data[i].push(q);
            q += h;
        }

        return data;
    }

    // get data points
    var data = ode();

    // copy data to arrays so we can plot it using JXG.Curve
    var t = [];
    var dataprey = [];
    var datapred = [];
    for(var i=0; i<data.length; i++) {
        t[i] = data[i][2];
        dataprey[i] = data[i][0];
        datapred[i] = data[i][1];
    }

	// Plot prey
    preycurve = predprey_board.createElement('curve', [t, dataprey], {strokeColor:preycolor, strokeWidth:'2'});
    preycurve.updateDataArray = function() {
        var data = ode();
        this.dataX = [];
        this.dataY = [];
        for(var i=0; i<data.length; i++) {
            this.dataX[i] = t[i];
            this.dataY[i] = data[i][0];
        }
    }

    // Plot predators
    predcurve = predprey_board.createElement('curve', [t, datapred], {strokeColor:predcolor, strokeWidth:'2'});
    predcurve.updateDataArray = function() {
        var data = ode();
        this.dataX = [];
        this.dataY = [];
        for(var i=0; i<data.length; i++) {
            this.dataX[i] = t[i];
            this.dataY[i] = data[i][1];
        }
    }

	// Plot phase space with steady states
				
	phasecurve = phase_board.createElement('curve', [datapred, dataprey], {strokeColor:phasecolor, strokeWidth:'2'});
	phasecurve.updateDataArray = function() {
	    var data = ode();
        this.dataX = [];
        this.dataY = [];
        for(var i=0; i<data.length; i++) {
            this.dataY[i] = data[i][0];
            this.dataX[i] = data[i][1];
        }
	}
	
	var FixedPoint = phase_board.create('point',[function(){return tangle.getValue("Yinf")},function(){return tangle.getValue("Xinf")}], {name:'', size:2, color: phasecolor});
	
	var Xp1 = phase_board.create('point',[0,function(){return FixedPoint.Y();}], {size:-1, name: 'X<sup>&#8734;</sup>'});
	var Xp2 = phase_board.create('point',[300,function(){return FixedPoint.Y();}], {size:-1, name: ''});
	var Xsteadyline = phase_board.create('line',[Xp1,Xp2], {straightFirst:false, straightLast:false, strokeWidth:2, color: preycolor});
	var Yp1 = phase_board.create('point',[function(){return FixedPoint.X();},0], {size:-1, name: 'Y<sup>&#8734;</sup>'});
	var Yp2 = phase_board.create('point',[function(){return FixedPoint.X();},300], {size:-1, name: ''});
	var Ysteadyline = phase_board.create('line',[Yp1,Yp2], {straightFirst:false, straightLast:false, strokeWidth:2, color: predcolor});
	
	initialized = true;

}


function setUpToggle() {

	function toggle() {
		if (set_adj_numbers) {
			$("span.inputField").toggleClass("TKNumberField");
			$("span.inputField").toggleClass("TKAdjustableNumber");
			set_adj_numbers = false;
			tangle.initializeElements();
		} else {
			$("span.inputField").toggleClass("TKAdjustableNumber");
			$("span.inputField").toggleClass("TKNumberField");
			set_adj_numbers = true;
			tangle.initializeElements();
		}
	
	}
	var set_adj_numbers = false;
	$("a#toggle-1").click(function(){toggle();});
	$("a#toggle-2").click(function(){toggle();});
	
}