function setUpUI() {
    function updateBoxSize() {
        jsPlumb.repaintEverything();
        tangle.setValue("box1size", $("#modelbox1").width() * $("#modelbox1").height());
        tangle.setValue("box2size", $("#modelbox2").width() * $("#modelbox2").height());
    }
    
    $('.modelbox')
        .resizable({ resize: function(event, ui) {updateBoxSize()}, autoHide: true, grid: [20, 20] });
    jsPlumb.draggable($('.modelbox'));
    $('.modelbox').draggable("option", {"containment":'parent', "cursor":'hand', "opacity":'0.5'});
    jsPlumb.connect({
    	source:"modelbox1", 
    	target:"modelbox2",
    	anchors:["RightMiddle", "LeftMiddle" ],
    	overlays:[ 
        		["Arrow", { width:12, length:10, location:1} ],
        		[ "Label", { label:'<span data-var="boxconnect" class="TKAdjustableNumber inputField" data-min="0" data-max="1" data-step="0.01" data-format="%.2f"></span>', location:0.3, cssClass:"connectorlabel"} ]
        	],
    	endpoint:"Dot",
    	endpointStyle:{ fillStyle: "" },
    	connector:"Straight",
    	paintStyle:{ strokeStyle:"#727272", lineWidth:2 }
    });
    firstbox1resize = true;
	$('#modelbox1').bind( "resize", function(event, ui) {
	    if (firstbox1resize) {
            $('#modelbox2').css("top","20px");
        }
        firstbox1resize = false;
    });
}

function setUpTangle() {

	var initialized = false;

	var element = document.getElementById("modelboxcontainer");

    tangle = new Tangle(element, {
        initialize: function () {
            this.box1in = 0.5;
            this.box1out = 0.8;
			this.box2in = 0.008;
			this.box2out = 1.0;
			this.boxconnect = 1.0;
			this.box1size = $("#modelbox1").width() * $("#modelbox1").height();
			this.box2size = $("#modelbox2").width() * $("#modelbox2").height();
        },
        update: function () {
			if (initialized) {
			    
			}
			if (this.k4 > 0) {
				$("span#k4_container").removeClass("eqInactive");
			} else {
				$("span#k4_container").addClass("eqInactive");
			}
        }
    });
	
	initialized = true;

}
