var dest = $.net.http.readDestination("covid19api");
var client = new $.net.http.Client();
var req = new $.web.WebRequest($.net.http.GET, "/summary");
client.request(req, dest);
var response = client.getResponse();
var JString = response.body.asString();
// var aString = JSON.parse(JString);
// var arr ="";
// for (var i =0; i<aString.Countries.length; i++){
// 	arr+="<div>"+aString.Countries[i].Country+" "+aString.Countries[i].TotalConfirmed+"</div>";
// 	}
// $.response.setBody(arr);
// $.response.setBody("<div>"+JString+"</div>");

$.response.setBody(JString);


