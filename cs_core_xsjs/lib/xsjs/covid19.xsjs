var dest = $.net.http.readDestination("covid19api");
var client = new $.net.http.Client();
var req = new $.web.WebRequest($.net.http.GET, "/summary");
client.request(req, dest);
var response = client.getResponse();
var JString = response.body.asString();
var aString = JSON.parse(JString);

if (aString.Global.length !== 0) {
try {
var connection = $.db.getConnection();
var pstmt = connection.prepareStatement(
'Upsert "covid_data.Global" values(?,?,?,?,?,?,?)');
pstmt.setBatchSize(1);
pstmt.setInt(1, aString.Global.NewConfirmed);
pstmt.setInt(2, aString.Global.TotalConfirmed);
pstmt.setInt(3, aString.Global.NewDeaths);
pstmt.setInt(4, aString.Global.TotalDeaths);
pstmt.setInt(5, aString.Global.NewRecovered);
pstmt.setInt(6, aString.Global.TotalRecovered);
pstmt.setString(7, aString.Global.Date);
pstmt.addBatch();
pstmt.executeBatch();
pstmt.close();
connection.commit();
connection.close();
$.response.setBody("Data Global uploaded successfully");
} catch (e) {
$.response.setBody(e.message);
}
}
if (aString.Countries.length !== 0) {
try {
connection = $.db.getConnection();
pstmt = connection.prepareStatement(
'Upsert "covid_data.Countries" values(?,?,?,?,?,?,?,?,?) WITH PRIMARY KEY');

var arrCountries = aString.Countries;
arrCountries.forEach(function(elem, index){
	pstmt.setBatchSize(1+index);
	pstmt.setString(1, elem.Country);
	pstmt.setString(2, elem.CountryCode);
	pstmt.setInt(3, elem.NewConfirmed);
	pstmt.setInt(4, elem.TotalConfirmed);
	pstmt.setInt(5, elem.NewDeaths);
	pstmt.setInt(6, elem.TotalDeaths);
	pstmt.setInt(7, elem.NewRecovered);
	pstmt.setInt(8, elem.TotalRecovered);
	pstmt.setString(9, elem.Date);
	pstmt.addBatch();
	pstmt.executeBatch();
});
pstmt.close();
connection.commit();
connection.close();
$.response.setBody("Data Countries uploaded successfully");
} catch (e) {
$.response.setBody(e.message);
}
}

//-----v2-------------
// if (aString.Countries.length !== 0) {
// try {
// connection = $.hdb.getConnection();
// var argsArr=[];
// var arrCountries = aString.Countries;
// arrCountries.forEach(function(elem){
// 	var row = [elem.Country, elem.CountryCode, elem.NewConfirmed, elem.TotalConfirmed, elem.NewDeaths, elem.TotalDeaths, elem.NewRecovered, elem.TotalRecovered, elem.Date];
// 	argsArr.push(row);
// });
// connection.executeUpdate('Insert into "covid_data.Countries" values(?,?,?,?,?,?,?,?,?)', argsArr);
// connection.commit();
// connection.close();
// $.response.setBody("Data Countries uploaded successfully");
// } catch (e) {
// $.response.setBody(e.message);
// }
// }
