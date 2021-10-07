var dest = $.net.http.readDestination("covid19api");
var client = new $.net.http.Client();
var req = new $.web.WebRequest($.net.http.GET, "/summary");
client.request(req, dest);
var response = client.getResponse();
var dataString = response.body.asString();
$.response.setBody(dataString);
