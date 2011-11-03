var boxModel = { 
    'config' : {
        'workspaceID' : 'modelboxcontainer',
    },
    
    'init' : function() {
        $('.modelbox')
            .resizable({ resize: function(event, ui) {boxModel.updateBoxSize()}, autoHide: true, grid: [20, 20] });
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
        firstboxresize = true;
    	$('.modelbox').bind( "resize", function(event, ui) {
    	    if (firstboxresize) {
                $('#modelbox2').css("top","70px");
            }
            firstboxresize = false;
        });
        // MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // Make sure MathJax catches stuff in any added labels
        MathJax.Hub.Config({
          menuSettings: {
            context: "browser",
          }
        });
    },
    
    'setupTangle' : function() {
        var tangleInitialized = false;
    	var element = document.getElementById(boxModel.config.workspaceID);
    	// TODO make tangle an internal var and return it in the end, so that can create as many as wanted,
    	// and generalize all tangle variables too
        tangle = new Tangle(element, {
            initialize: function () {
                this.box1in = 0.5;
                this.box1out = 0.1;
    			this.box2in = 0.008;
    			this.box2out = 0;
    			this.box1to2 = 1.0;
    			this.box2to1 = 0;
    			this.box1size = boxModel.getBoxSize(1);
    			this.box2size = boxModel.getBoxSize(2);
            },
            update: function () {
    			if (tangleInitialized) {
                    // nothing in here right now
    			}
                // Set variables greyed or non-greyed
                boxModel.updateUI();
            },
        });
    	boxModel.updateUI();
    	tangleInitialized = true;
    	return tangle;
    },
    
    'updateUI' : function() {
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
    },
    
    'updateBoxSize' : function() {
        jsPlumb.repaintEverything();
        tangle.setValue("box1size", boxModel.getBoxSize(1));
        tangle.setValue("box2size", boxModel.getBoxSize(2));
    },
    
    'getBoxSize' : function(box) {
        var boxsize = $("#modelbox"+box).width() * $("#modelbox"+box).height() / 100;
        return boxsize
    }
};