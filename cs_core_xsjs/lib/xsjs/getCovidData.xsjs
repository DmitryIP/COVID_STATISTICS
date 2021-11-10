// eslint-disable-next-line
function getDataFromAPI() { 								
	// make request for data
	var dest = $.net.http.readDestination("covid19api");
	var client = new $.net.http.Client();
	var req = new $.web.WebRequest($.net.http.GET, "/summary");
	client.request(req, dest);
	var response = client.getResponse();
	var JString = response.body.asString();
	var aString = JSON.parse(JString);

	// fill table Global
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
			// eslint-disable-next-line
			console.log("Data Global uploaded successfully " );
		} catch (e) {
			throw e;
		}
	}
	// fill table Countries
	if (aString.Countries.length !== 0) {
		try {
			connection = $.db.getConnection();
			pstmt = connection.prepareStatement(
				'Upsert "covid_data.Countries" values(?,?,?,?,?,?,?,?,?) WITH PRIMARY KEY');

			var arrCountries = aString.Countries;
			arrCountries.forEach(function (elem, index) {
				pstmt.setBatchSize(1 + index);
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
			// eslint-disable-next-line
			console.log("Data Countries uploaded successfully ");
		} catch (e) {
			throw e;
		}
	}
}