function setUpUI() {
    var updateBoxSize = function() {
        jsPlumb.repaintEverything();
        tangle.setValue("box1size", $("#modelbox1").width() * $("#modelbox1").height());
        tangle.setValue("box2size", $("#modelbox2").width() * $("#modelbox2").height());
    }
    
    $('.modelbox')
        .resizable({ resize: function(event, ui) {updateBoxSize()}, autoHide: true, grid: [20, 20] });
    jsPlumb.draggable($('.modelbox'));
    $('.modelbox').draggable("option", {"containment":'parent', "cursor":'hand', "opacity":'0.5', });
    var common = {
    	endpoint:"Blank",
    	endpointStyle:{ fillStyle: "" },
    	connector:"Straight",
    	paintStyle:{ strokeStyle:"#727272", lineWidth:2 }
    };
    jsPlumb.connect({
    	source:"modelbox1", 
    	target:"modelbox2",
    	anchors:[[1, 0.25, 1, 0], [0, 0.25, -1, 0]],
    	overlays:[ 
        		["Arrow", { width:12, length:10, location:1} ],
        		[ "Label", { label:'<span data-var="box1to2" class="TKAdjustableNumber inputField" data-min="0" data-max="1" data-step="0.01" data-format="%.2f"></span>', location:0.5, cssClass:"connectorlabel connectorlabel1"} ]
        	],
    }, common);
    jsPlumb.connect({
    	source:"modelbox2", 
    	target:"modelbox1",
    	anchors:[[0, 0.75, -1, 0], [1, 0.75, 1, 0]],
    	overlays:[ 
        		["Arrow", { width:12, length:10, location:1} ],
        		[ "Label", { label:'<span data-var="box2to1" class="TKAdjustableNumber inputField" data-min="0" data-max="1" data-step="0.01" data-format="%.2f"></span>', location:0.5, cssClass:"connectorlabel connectorlabel2"} ]
        	],
    }, common);
    firstboxresize = true;
	$('.modelbox').bind( "resize", function(event, ui) {
	    if (firstboxresize) {
            $('#modelbox2').css("top","70px");
        }
        firstboxresize = false;
    });
}

function updateUIElements () {
    $("span.inputField span").each(function () {
        if (Number($(this).text()) == 0) {
          $(this).parent().parent().addClass("eqInactive");
        } else {
          $(this).parent().parent().removeClass("eqInactive");
        }
    });
}

function setUpTangle() {

	var tangleInitialized = false;

	var element = document.getElementById("modelboxcontainer");

    tangle = new Tangle(element, {
        initialize: function () {
            this.box1in = 0.5;
            this.box1out = 0.8;
			this.box2in = 0.008;
			this.box2out = 1.0;
			this.box1to2 = 1.0;
			this.box2to1 = 0;
			this.box1size = $("#modelbox1").width() * $("#modelbox1").height();
			this.box2size = $("#modelbox2").width() * $("#modelbox2").height();
        },
        update: function () {
			if (tangleInitialized) {
			    
			}
            updateUIElements();
        },
    });
	
	updateUIElements();
	tangleInitialized = true;

}
