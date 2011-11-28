// Add Object.create() as per Douglas Crockford
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

var boxModel = {};

boxModel.config = {
        workspaceID : 'modelboxcontainer',
        modelboxID  : 'modelbox'
    };
    
boxModel.init = function () {
    $('.modelbox').resizable({ 
        resize: function(event, ui) {boxModel.updateBoxSize()}, 
        autoHide: true,
        grid: [20, 20],
        containment: 'parent',
        minHeight: 100,
        minWidth: 100,
    });
    jsPlumb.draggable($('.modelbox'));
    $('.modelbox').draggable("option", {"containment":'parent', "cursor":'hand', "opacity":'0.5', });
    jsPlumb.Defaults.LabelStyle = { font: " ", color: " " }; // Set these to " " so that jsPlumb doesn't mess up CSS styles
    var common = {
        endpoint:"Blank",
        endpointStyle:{ fillStyle: "" },
        connector:"Straight",
        paintStyle:{ strokeStyle:"#727272", lineWidth:2 }

    };
    connector_box1_box2 = jsPlumb.connect({
        source:"modelbox1", 
        target:"modelbox2",
        anchors:[[1, 0.25, 1, 0], [0, 0.25, -1, 0]],
        overlays:[ 
                ["Arrow", { id: 'arrow', width:12, length:10, location:1} ],
                [ "Label", { id: 'label', label:'<span data-var="box1to2" class="TKAdjustableNumber inputField" data-min="0" data-max="1" data-step="0.01" data-format="%.2f"></span> <em>M</em><sub>1</sub>', location:0.45, cssClass:"connectorlabel label_box1_box2"} ]
            ],
    }, common);
    connector_box2_box1 = jsPlumb.connect({
        source:"modelbox2", 
        target:"modelbox1",
        anchors:[[0, 0.75, -1, 0], [1, 0.75, 1, 0]],
        overlays:[ 
                ["Arrow", { id: 'arrow', width:12, length:10, location:1} ],
                [ "Label", { id: 'label', label:'<span data-var="box2to1" class="TKAdjustableNumber inputField" data-min="0" data-max="1" data-step="0.01" data-format="%.2f"></span> <em>M</em><sub>2</sub>', location:0.55, cssClass:"connectorlabel label_box2_box1"} ]
            ],
    }, common);
    // MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // Make sure MathJax catches stuff in any added labels
    MathJax.Hub.Config({
      menuSettings: {
        context: "browser",
      }
    });
    
    tangle = boxModel.setupTangle();
    boxModel.setupBoards(tangle);
};

boxModel.setupTangle = function () {
    var tangleInitialized = false;
    var element = document.getElementById(boxModel.config.workspaceID);
    // TODO make tangle an internal var and return it in the end, so that can create as many as wanted,
    // and generalize all tangle variables too
    tangle = new Tangle(element, {
        initialize: function () {
            this.box1in = 5;
            this.box1out = 0;
            this.box2in = 0;
            this.box2out = 0.1;
            this.box1to2 = 0.4;
            this.box2to1 = 0.1;
            // this.box1size = boxModel.getBoxSize(1);
            // this.box2size = boxModel.getBoxSize(2);
            this.box1start = boxModel.getBoxSize(1) / 2;
            this.box2start = boxModel.getBoxSize(2) / 2;
        },
        update: function () {
            if (tangleInitialized) {
                solution_board.fullUpdate()
            }
            // Set variables greyed or non-greyed
            this.a11 = this.box1to2 + this.box1out;
            this.a21 = this.box2to1 + this.box2out;
            boxModel.updateUI();
        },
    });
    boxModel.updateUI();
    tangleInitialized = true;
    return tangle;
};

boxModel.modelBox = {
    'init' : function (boxId) {
        var theBox = this;
        var initialized = false;
        var boxNumber = boxId;
        $('#'+boxModel.config.workspaceID).append(this.html(boxNumber));
        var tangle = new Tangle($('#'+boxModel.config.modelboxID+boxNumber), {
            initialize: function () {
                this.boxin = 0;
                this.boxout = 0;
                this.boxsize = theBox.getBoxSize();
            },
            update: function () {
                if (theBox.initialized) {
                    solution_board.fullUpdate()
                }
                boxModel.updateUI();
            },
        });
        // add this box to the list/array/whatever of boxes
        boxModel.updateUI(); // TODO updateUI() must update everything according to the list of boxes
        initialized = true;
    },
    
    'html' : function (boxNumber) {
        return '<div class="modelbox" id="'+boxModel.config.modelboxID+boxNumber+'">'
            +'<p><span class="boxname"><em>M</em><sub>'+boxNumber+'</sub></span></p>'
            +'<p><span class="boxsize">Initial value: <span data-var="boxsize"></span></span></p>'
            +'<span class="boxinput"><span data-var="boxin" class="TKAdjustableNumber inputField" data-min="0" data-max="200" data-step="1" data-format="%.0f"></span></span>'
            +'<span class="boxoutput"><span data-var="boxout" class="TKAdjustableNumber inputField" data-min="-1" data-max="1" data-step="0.01" data-format="%.2f"></span> <em>M</em><sub>'+boxNumber+'</sub></span>'
        +'</div>';
    },

    'getBoxSize' : function () {
        var boxsize = $("#"+boxModel.config.modelboxID+this.boxNumber).width() * $("#"+boxModel.config.modelboxID+this.boxNumber).height() / 100;
        return boxsize
    }
};
    
boxModel.modelBoxConnection = {
    'init' : function (box1, box2) {
        // todo
    },
};
    
boxModel.setupBoards = function (tangle) {
    // Set up the drawing boards
    JXG.Options = JXG.deepCopy(JXG.Options, {
        showNavigation: false,
        showCopyright: false,
        axis: {
            lastArrow: false,
        }
    });
    
    solution_board = JXG.JSXGraph.initBoard('solution_board', {boundingbox: [-1.5, 302.5, 77.5, -20.5], axis: true, grid: false});
    // JXG.Options.axis.ticks.drawLabels = false; // disable labels before drawing phase board
    phase_board = JXG.JSXGraph.initBoard('phase_board', {boundingbox: [-1.5, 302.5, 302.5, -20.5], axis: true, grid: false});
    solution_board.addChild(phase_board);

    // Disable mouse wheel scrolling
    JXG.removeEvent(solution_board.containerObj, 'mousewheel', solution_board.mouseWheelListener,
    solution_board);
    JXG.removeEvent(solution_board.containerObj, 'DOMMouseScroll',
    solution_board.mouseWheelListener, solution_board);
    JXG.removeEvent(phase_board.containerObj, 'mousewheel', phase_board.mouseWheelListener,
    phase_board);
    JXG.removeEvent(phase_board.containerObj, 'DOMMouseScroll',
    phase_board.mouseWheelListener, phase_board);

    // Set colors
    var box1color = '#91BFDB';
    var box2color = '#FC8D59';
    var phasecolor = '#31A354';

    // Variables for the JXG.Curves
    var box1curve, box2curve, phasecurve;

    // Initialise ODE and solve it with JXG.Math.Numerics.rungeKutta()
    function ode() {
        // evaluation interval
        var I = [0, 75];
        // Number of steps. 1000 should be enough
        var N = 1000;

        var in_1 = tangle.getValue("box1in");
        var in_2 = tangle.getValue("box2in");
        var out_1 = tangle.getValue("box1out");
        var out_2 = tangle.getValue("box2out");
        var conn_1_2 = tangle.getValue("box1to2");
        var conn_2_1 = tangle.getValue("box2to1");

        // Right hand side of the ODE dx/dt = f(t, x)
        var f = function(t, x) {
            var y = [];
            y[0] = in_1 - (conn_1_2+out_1)*x[0] + conn_2_1*x[1];
            y[1] = in_2 + conn_1_2*x[0]         - (conn_2_1+out_2)*x[1];
            return y;
        }

        // Initial value
        var x0 = [tangle.getValue("box1start"), tangle.getValue("box2start")];

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
    var dataBox1 = [];
    var dataBox2 = [];
    for(var i=0; i<data.length; i++) {
        t[i] = data[i][2];
        dataBox1[i] = data[i][0];
        dataBox2[i] = data[i][1];
    }

    // Plot box1
    box1curve = solution_board.createElement('curve', [t, dataBox1], {strokeColor:box1color, strokeWidth:'2'});
    box1curve.updateDataArray = function() {
        var data = ode();
        this.dataX = [];
        this.dataY = [];
        for(var i=0; i<data.length; i++) {
            this.dataX[i] = t[i];
            this.dataY[i] = data[i][0];
        }
    }

    // Plot box2
    box2curve = solution_board.createElement('curve', [t, dataBox2], {strokeColor:box2color, strokeWidth:'2'});
    box2curve.updateDataArray = function() {
        var data = ode();
        this.dataX = [];
        this.dataY = [];
        for(var i=0; i<data.length; i++) {
            this.dataX[i] = t[i];
            this.dataY[i] = data[i][1];
        }
    }

    // Plot phase space with steady states
    phasecurve = phase_board.createElement('curve', [dataBox2, dataBox1], {strokeColor:phasecolor, strokeWidth:'2'});
    phasecurve.updateDataArray = function() {
        var data = ode();
        this.dataX = [];
        this.dataY = [];
        for(var i=0; i<data.length; i++) {
            this.dataY[i] = data[i][0];
            this.dataX[i] = data[i][1];
        }
    }

    // var FixedPoint = phase_board.create('point',[function(){return tangle.getValue("Yinf")},function(){return tangle.getValue("Xinf")}], {name:'', size:2, color: phasecolor});
    // 
    // var Xp1 = phase_board.create('point',[0,function(){return FixedPoint.Y();}], {size:-1, name: 'X<sup>&#8734;</sup>'});
    // var Xp2 = phase_board.create('point',[300,function(){return FixedPoint.Y();}], {size:-1, name: ''});
    // var Xsteadyline = phase_board.create('line',[Xp1,Xp2], {straightFirst:false, straightLast:false, strokeWidth:2, color: box1color});
    // var Yp1 = phase_board.create('point',[function(){return FixedPoint.X();},0], {size:-1, name: 'Y<sup>&#8734;</sup>'});
    // var Yp2 = phase_board.create('point',[function(){return FixedPoint.X();},300], {size:-1, name: ''});
    // var Ysteadyline = phase_board.create('line',[Yp1,Yp2], {straightFirst:false, straightLast:false, strokeWidth:2, color: box2color});
    
};
    
boxModel.updateUI = function () {
    $("span.inputField span").each(function () {
        var fieldNumber = Number($(this).text());
        var fieldContainer = $(this).parent().parent();
        // Next two lines are hack-ish, probably there is a much better way:
        // If there is any data in data.('former') take that (even if it's '0'), else, initialize it with fieldNumber
        var former_fieldNumber = $(this).data('former') || fieldNumber
        if ($(this).data('former') == 0) {former_fieldNumber = 0;}
        if (fieldNumber == 0) {
            fieldContainer.addClass("var_inactive");
        } else {
            fieldContainer.removeClass("var_inactive");
            if (fieldNumber > 0) {fieldContainer.addClass("var_positive");fieldContainer.removeClass("var_negative");}
            if (fieldNumber < 0) {fieldContainer.addClass("var_negative");fieldContainer.removeClass("var_positive");}
        }
        $(this).data('former', fieldNumber);
    });
};
    
boxModel.updateBoxSize = function () {
    jsPlumb.repaintEverything();
    tangle.setValue("box1start", boxModel.getBoxSize(1)/2);
    tangle.setValue("box2start", boxModel.getBoxSize(2)/2);
};

boxModel.getBoxSize = function (box) {
    var boxsize = $("#modelbox"+box).width() * $("#modelbox"+box).height() / 100;
    return boxsize
};