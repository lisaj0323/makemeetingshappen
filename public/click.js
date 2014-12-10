  
$(document).ready(function(){
	console.log("inside the click.js");


//reference: http://jsfiddle.net/daver182/cB4UQ/1/

 //  	var isMouseDown = false,
	//     	isHighlighted;
	// var currentCol;
	// var startEnd = [];
	// var slot ={};

	//  	$("#timetable").on('mousedown', '#our_table td', function(){
	//     	console.log("mouse down : " + $(this).attr("dateTime"));
	//     	slot.start = $(this).attr('dateTime');
	//     	console.log("slot with start key : " + JSON.stringify(slot));
	// 	      isMouseDown = true;
	// 	      currentCol = this.getAttribute("data-col");
	// 	      $(this).toggleClass("highlighted");
	// 	      isHighlighted = $(this).hasClass("highlighted");
	// 	      return false; // prevent text selection
	//     });

	//  	$("#timetable").on('mouseover', '#our_table td', function(){
	//       if (isMouseDown) {
	//           if(currentCol === this.getAttribute("data-col")){
	//               $(this).toggleClass("highlighted", isHighlighted);
	//           }
	//       }
	//     });

	//     $("#timetable").on("mouseup", "#our_table td", function(){
	//     	console.log("last dragged box : " + $(this).attr("dateTime"));
	//     	slot.end = $(this).attr("dateTime");
	//     	dateTime.push(slot);
	//     	console.log("dateTime has " + JSON.stringify(dateTime));

	//     })

	//     $("#our_table td").bind("selectstart", function () {
	//       return false;
	//     });

	// 	$(document).mouseup(function () {
	// 	    isMouseDown = false;
	// 	});
	//  //})	


 //  		$('#calendar').multiDatesPicker({
	// 		dateFormat: "yyyy-mm-dd"
 //  		});

 //  		// $('#timeFirst').timepicker({'timeFormat': 'H:i:s'});
 //  		// $('#timeLast').timepicker({'timeFormat': 'H:i:s', 'step': 30});


})