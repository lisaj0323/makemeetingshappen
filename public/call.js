$(document).ready(function(){
	console.log("inside the ajax call");

	//e.preventDefault();
	var keylist="abcdefghijklmnopqrstuvwxyz123456789";
	var temp='';

	//This random url generated was from http://www.javascriptkit.com/script/script2/passwordgenerate.shtml
	function generateEventId(){
		temp=''
		for (i=0;i<10;i++){
			temp+=keylist.charAt(Math.floor(Math.random()*keylist.length));
		}
		return temp;
	}

	$("#makeEvent").click(function(e){
		console.log("new meeting is clicked")
		e.preventDefault();

			$.ajax({
				url: "/event/insert?id=" + generateEventId(),
				type: 'GET',
				success: function(result) {
					$('body').html(result);
					
				}
			});
	})
	

	var firstTime;
		var lastTime;
		var rows, col;
		var colName=[];
		var rowName=[];
		var parts;
		var eventName;
		
	$('#showtable').click(function(e){
		e.preventDefault();

		firstTime = $('#timeFirst').val();
		lastTime = $('#timeLast').val();

		function generateColName(){
			var year, month, day;
			var days=[];

			$(".ui-state-highlight .ui-state-default").each(function(){
				days.push($(this).text());
			});

			$(".ui-state-highlight[data-handler=selectDay]").each(function(i){
				year = $(this).attr("data-year");
				month = $(this).attr("data-month");
				day = days[i];
				colName.push(year+"-"+month+"-"+day);
			});
			console.log("colName " + colName)
			return colName;

		}

		function generateRows(){
			//reference from http://stackoverflow.com/questions/17157337/how-do-i-calculate-the-time-difference-between-strings-in-javascript
			function toSeconds(time_str) {
			    // Extract hours, minutes and seconds
			    parts = time_str.split(':');
			    // compute  and return total seconds

			    return parts[0] * 3600 + // an hour has 3600 seconds
			           parts[1] * 60; +   // a minute has 60 seconds
			           +parts[2];        // seconds
			}

			var difference = Math.abs(toSeconds(firstTime) - toSeconds(lastTime));

			// compute hours, minutes and seconds
			var times = [
			    // an hour has 3600 seconds so we have to compute how often 3600 fits
			    // into the total number of seconds
			    Math.floor(difference / 3600), // HOURS
			    // similar for minutes, but we have to "remove" the hours first;
			    // this is easy with the modulus operator
			    Math.floor((difference % 3600) / 60),// MINUTES
			    // the remainder is the number of seconds
			    difference % 60 // SECONDS
			];		


			function checkMinute(){
				if(times[1] == 30){
					return 1;
				}
				else{
					return 0;
				}
			}

			console.log("time values : " + times[0] + " , " + times[1]);
			//+1 at the end for the space to write down dates at the top
			rows = times[0]*2 + checkMinute() + 1;
			return rows;
		}//end generateRows fn

		function generateRowName(){
			var time = firstTime;
			console.log("time is " + time +" and uses rows " + rows);
			for(var k=0; k< rows;k+=2){
				console.log("k : " + k);
				if(k==0){
					console.log("goes through first index")
					rowName.push(time);
				}
				else{
					var divide=time.split(":");
					divide[0]=(Number(divide[0])+1).toString();
					time = divide.join(":");
					rowName.push(time);
				}
			}
			console.log("rowName are " + rowName);
		}

			generateRows();
			generateColName();
			generateRowName();
			var body = document.getElementById("timetable");

			var col = $(".ui-state-highlight .ui-state-default").length; 

			console.log("col: " + col);
			console.log("row: " + rows);	

			  // creates a <table> element and a <tbody> element
			var tbl     = document.createElement("table");
			tbl.setAttribute("id", "our_table")
			var tblHead = document.createElement("thead");
			var tblBody = document.createElement("tbody");

			var thdRow = document.createElement("tr");
			//creating all tbleHead
			for(var z=0; z< col; z++){
				if(z==0){
					var thdCell = document.createElement("th");
					thdRow.appendChild(thdCell);
				}
				
				var thdCell = document.createElement("th");
				thdCell.setAttribute("class", colName[z]);
				var thdTextNode = document.createTextNode(colName[z]); 
				thdCell.appendChild(thdTextNode);
				thdRow.appendChild(thdCell);

			}
			tblHead.appendChild(thdRow);
			tbl.appendChild(tblHead);


			  // creating all cells ( tbleBody)
			for (var i = 0; i < rows; i++) {
			    // creates a table row
				var row = document.createElement("tr");
			 
			    for (var j = 0; j < col; j++) {
			      // Create a <td> element and a text node, make the text
			      // node the contents of the <td>, and put the <td> at
			      // the end of the table row
			      if(j==0){
			      	var textNode;
			      	if(i%2==0){
			      		textNode = document.createTextNode(rowName[i/2].slice(0,5));
			      	}
			      	else{
			      		textNode = document.createTextNode("");
			      	}
			      	var thCell = document.createElement("th");
			      	thCell.appendChild(textNode);
			      	row.appendChild(thCell);
			    
			      }
			      // else{
			      // 	var thCell = document.createElement("th");
			      // 	row.appendChild(thCell);
			      // }
				    var cell = document.createElement("td");
				    cell.setAttribute("data-row", i); //needs to start from 1
				   	cell.setAttribute("data-col", j);//createTextNode("cell in row "+i+", column "+j);

				   	if(i%2==1){
				   		var change = rowName[Math.floor(i/2)].split(":");
				   		change[1]="30";
				   		var backToTime = change.join(":");
				   		var dateTime = colName[j]+"T"+backToTime+"Z";
				   		cell.setAttribute("dateTime", dateTime )
				   	}
				   	else{
				   		var stayTime = colName[j]+"T"+rowName[i/2]+"Z";
				   		cell.setAttribute("dateTime", stayTime);
				   	}
				    //cell.setAttribute("class", colName[j]); ////////
				    //cell.appendChild(cellText);
				    row.appendChild(cell);
			    }
				 
			    // add the row to the end of the table body
				tblBody.appendChild(row);
			}
			 
			  // put the <tbody> in the <table>
				tbl.appendChild(tblBody);
			  // appends <table> into <body>
			    body.appendChild(tbl);
			 
		// $.getJSON("test.json", function(res){

		// })
	})


	var isMouseDown = false,
	    	isHighlighted;
	var currentCol;
	var startEnd = [];
	//var slot =[];

	 	$("#timetable").on('mousedown', '#our_table td', function(){
	    	//console.log("mouse down : " + $(this).attr("dateTime"));
		      isMouseDown = true;
		      currentCol = this.getAttribute("data-col");
		      $(this).toggleClass("highlighted");
		      isHighlighted = $(this).hasClass("highlighted");
		  //     if(isHighlighted){
		  //     	slot.start = $(this).attr('dateTime');
		  //     }else{
		  //     	for (var i = 0; i < startEnd.length; i++){
				//   // look for the entry with a matching `code` value
				//   if (startEnd[i].start == $(this).attr('dateTime')){
				//      startEnd.splice(i, 1);// we found it
				//     // obj[i].name is the matched result
				//   }
				// }
		  //     }
		      return false; // prevent text selection
	    });

	 	$("#timetable").on('mouseover', '#our_table td', function(){
	      if (isMouseDown) {
	          if(currentCol === this.getAttribute("data-col")){
	              $(this).toggleClass("highlighted", isHighlighted);
	          }
	      }
	    });

	    $("#timetable").on("mouseup", "#our_table td", function(){
	    	console.log("last dragged box : " + $(this).attr("dateTime"));
	    	// if($(this).hasClass('highlighted')){
	    	// 	slot.end = $(this).attr("dateTime");
	    	// 	startEnd.push(slot);
	    	// }
	    	
	    	console.log("dateTime has " + JSON.stringify(startEnd));

	    })

	    $("#our_table td").bind("selectstart", function () {
	      return false;
	    });

		$(document).mouseup(function () {
		    isMouseDown = false;
		});
	 //})	


  		$('#calendar').multiDatesPicker({
			dateFormat: "yyyy-mm-dd"
  		});

  		// $('#timeFirst').timepicker({'timeFormat': 'H:i:s'});
  		// $('#timeLast').timepicker({'timeFormat': 'H:i:s', 'step': 30});

	$('#savetable').on('click', function(e){
		console.log("savemeeting clicked");
		var id=$("#id").text();
		eventName=$('#title').val();
		console.log("eventName : " + eventName)
		e.preventDefault();

		$('.highlighted').each(function(){
			startEnd.push($( this ).attr("datetime"));
		})

		//fruit/update?find={"name":"pear"}&update={"$set":{"leaves":"green"}}
		var urlOne = '/event/update?find={"id":' + '"'+id+'"' + '}&update={"$set":{"name":'+ '"'+ eventName+'","dateTime":'+JSON.stringify(startEnd)+
		',"earliest":"'+firstTime+'","latest":"'+lastTime+'","dates":'+ JSON.stringify(colName)+'}}';

		console.log("urlOne : " + urlOne);

		$.ajax({
			url: urlOne,
			type: 'POST',
			success: function(result) {
				console.log("result after ajax: " + result)
				$('body').html(result);
				
			}
		});
	})

	function getUrl(){ //make url for Update functionality 

		var id=$("#id").text();
		eventName=$('#title').val();
				var myObj = {};
				myObj["id"] = id;

				var sObj = {};
				sObj["name"] = eventName;
				sObj["dateTime"] = startEnd;
				sObj["earliest"]= firstTime;
				sObj["lastest"]=lastTime;
				sObj["dates"]=colName;
				console.log("sObj : " + JSON.stringify(sObj));

				var bObj = {};
				bObj["$set"] = sObj;
				console.log("bObj : " + JSON.stringify(bObj))

				var url = '/person/update?find=' + JSON.stringify(myObj) + '&update=' + JSON.stringify(bObj);
				console.log("url : " + url);
				return url;
			}

	// console.log("clicked");
	// 	generatepass();
	// 	console.log("temp: " + temp);
	// 	var newUrl = "/event/"+temp; //location.href="http://localhost:50000/event/"+temp
	// 	console.log(newUrl);

	// 	$.ajax({
	// 		url:'newUrl', 
	// 		type: 'GET',
	// 		success: function(result){
	// 			$("#welcome").html(result);
	// 		}
	// 	});
	
	

});