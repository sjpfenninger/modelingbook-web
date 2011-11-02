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
    connector_box1_box2 = jsPlumb.connect({
    	source:"modelbox1", 
    	target:"modelbox2",
    	anchors:[[1, 0.25, 1, 0], [0, 0.25, -1, 0]],
    	overlays:[ 
        		["Arrow", { id: 'arrow', width:12, length:10, location:1} ],
        		[ "Label", { id: 'label', label:'<span data-var="box1to2" class="TKAdjustableNumber inputField" data-min="0" data-max="1" data-step="0.01" data-format="%.2f"></span>', location:0.45, cssClass:"connectorlabel label_box1_box2"} ]
        	],
    }, common);
    connector_box2_box1 = jsPlumb.connect({
    	source:"modelbox2", 
    	target:"modelbox1",
    	anchors:[[0, 0.75, -1, 0], [1, 0.75, 1, 0]],
    	overlays:[ 
        		["Arrow", { id: 'arrow', width:12, length:10, location:1} ],
        		[ "Label", { id: 'label', label:'<span data-var="box2to1" class="TKAdjustableNumber inputField" data-min="0" data-max="1" data-step="0.01" data-format="%.2f"></span>', location:0.55, cssClass:"connectorlabel label_box2_box1"} ]
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
        var fieldNumber = Number($(this).text());
        var fieldContainer = $(this).parent().parent();
        // Next two lines are hack-ish, probably there is a much better way:
        // If there is any data in data.('former') take that (even if it's '0'), else, initialize it with fieldNumber
        var former_fieldNumber = $(this).data('former') || fieldNumber
        if ($(this).data('former') == 0) {former_fieldNumber = 0;}
        if (fieldNumber == 0) {
            fieldContainer.addClass("eqInactive");
        } else {
            fieldContainer.removeClass("eqInactive");
            if (fieldNumber > 0) {fieldContainer.addClass("eqPositive");fieldContainer.removeClass("eqNegative");}
            if (fieldNumber < 0) {fieldContainer.addClass("eqNegative");fieldContainer.removeClass("eqPositive");}
        }
        $(this).data('former', fieldNumber);
    });
}

function setUpTangle() {

	var tangleInitialized = false;

	var element = document.getElementById("modelboxcontainer");

    tangle = new Tangle(element, {
        initialize: function () {
            this.box1in = 0.5;
            this.box1out = 0.1;
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
            // Set variables greyed or non-greyed
            updateUIElements();
            
            // Update `label` member of all label overlays
            // connector_box1_box2.getOverlay('label').label  = $(".label_box1_box2").html();
            // connector_box1_box2.getOverlay('label').label  = 'NOUPDATE';
            
        },
    });
	
	updateUIElements();
	tangleInitialized = true;

}
