  
$(document).ready(function(){
	console.log("inside the click.js");


	var firstTimes;
	var lastTimes;
	var row, cols;
	var colNames=[];
	var rowNames=[];
	var parts;
	var eventNames;

		firstTimes = $('#timeFirstt').text();
		lastTimes = $('#timeLastt').text();
		cols = $('#colNum').length;
		colNames = $('#colNum').text().split(',');
		console.log("colname " + colNames + " cols " + cols)



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

			var differences = Math.abs(toSeconds(firstTimes) - toSeconds(lastTimes));

			// compute hours, minutes and seconds
			var timess = [
			    // an hour has 3600 seconds so we have to compute how often 3600 fits
			    // into the total number of seconds
			    Math.floor(differences / 3600), // HOURS
			    // similar for minutes, but we have to "remove" the hours first;
			    // this is easy with the modulus operator
			    Math.floor((differences % 3600) / 60),// MINUTES
			    // the remainder is the number of seconds
			    differences % 60 // SECONDS
			];		


			function checkMinute(){
				if(timess[1] == 30){
					return 1;
				}
				else{
					return 0;
				}
			}

			console.log("time values : " + timess[0] + " , " + timess[1]);
			//+1 at the end for the space to write down dates at the top
			row = timess[0]*2 + checkMinute() + 1;
			//return row;
		}//end generateRows fn

		function generateRowNames(){
			var time = firstTimes;
			console.log("time is " + time +" and uses rows " + row);
			for(var k=0; k< row;k+=2){
				if(k==0){
					console.log("goes through first index")
					rowNames.push(time);
				}
				else{
					var divide=time.split(":");
					divide[0]=(Number(divide[0])+1).toString();
					time = divide.join(":");
					rowNames.push(time);
				}
			}
			console.log("rowName are " + rowNames);
		}


		function drawtable(){
	
			generateRows();
			generateRowNames();
			var body = document.getElementById("timetable2");

			console.log("col: " + cols);
			console.log("row: " + row);	

			  // creates a <table> element and a <tbody> element
			var tbl     = document.createElement("table");
			tbl.setAttribute("id", "our_table")
			var tblHead = document.createElement("thead");
			var tblBody = document.createElement("tbody");

			var thdRow = document.createElement("tr");
			//creating all tbleHead
			for(var z=0; z< cols; z++){
				if(z==0){
					var thdCell = document.createElement("th");
					thdRow.appendChild(thdCell);
				}
				console.log("z" + z);
				var thdCell = document.createElement("th");
				thdCell.setAttribute("class", colNames[z]);
				var thdTextNode = document.createTextNode(colNames[z]); 
				thdCell.appendChild(thdTextNode);
				thdRow.appendChild(thdCell);

			}
			tblHead.appendChild(thdRow);
			tbl.appendChild(tblHead);


			  // creating all cells ( tbleBody)
			for (var i = 0; i < row; i++) {
			    // creates a table row
				var roww = document.createElement("tr");
				console.log("i " + i);
			 
			    for (var j = 0; j < cols; j++) {
			      // Create a <td> element and a text node, make the text
			      // node the contents of the <td>, and put the <td> at
			      // the end of the table row
			      console.log("j" + j);
			      if(j==0){
			      	var textNode;
			      	if(i%2==0){
			      		textNode = document.createTextNode(rowNames[i/2].slice(0,5));
			      	}
			      	else{
			      		textNode = document.createTextNode("");
			      	}
			      	var thCell = document.createElement("th");
			      	thCell.appendChild(textNode);
			      	roww.appendChild(thCell);
			    
			      }
			      // else{
			      // 	var thCell = document.createElement("th");
			      // 	row.appendChild(thCell);
			      // }
				    var cell = document.createElement("td");
				    cell.setAttribute("data-row", i); //needs to start from 1
				   	cell.setAttribute("data-col", j);//createTextNode("cell in row "+i+", column "+j);

				   	if(i%2==1){
				   		var change = rowNames[Math.floor(i/2)].split(":");
				   		change[1]="30";
				   		var backToTime = change.join(":");
				   		var dateTime = colNames[j]+"T"+backToTime+"Z";
				   		cell.setAttribute("dateTime", dateTime )
				   	}
				   	else{
				   		var stayTime = colNames[j]+"T"+rowNames[i/2]+"Z";
				   		cell.setAttribute("dateTime", stayTime);
				   	}
				    //cell.setAttribute("class", colName[j]); ////////
				    //cell.appendChild(cellText);
				    roww.appendChild(cell);
			    }
				 
			    // add the row to the end of the table body
				tblBody.appendChild(roww);
			}
			 
			  // put the <tbody> in the <table>
				tbl.appendChild(tblBody);
			  // appends <table> into <body>
			    body.appendChild(tbl);

		// $.getJSON("test.json", function(res){

		// })
	//})
}

drawtable();


})