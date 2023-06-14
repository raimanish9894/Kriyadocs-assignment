import React, { useState, useEffect } from "react";
 import "./Map.css";
 import "leaflet/dist/leaflet.css";
 import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
 
 const Map = () => {
   const continentalCoordinates = {
     "Africa": { lat: 9.1021, lng: 18.2812 },
     "Asia": { lat: 34.0479, lng: 100.6197 },
     "Europe": { lat: 55.3781, lng: 3.436 },
     "North-America": { lat: 43.0, lng: -75.0 },
     "South-America": { lat: -15.793889, lng: -47.882778 },
     "Oceania": { lat: -33.865143, lng: 151.2099 },
   };
 
   const [countryData, setCountryData] = useState();
   const [selectedContinent, setSelectedContinent] = useState(null);
 
   const [search, setSearch] = useState("");
   const [caseData, setCaseData] = useState();
   const [deathData, setDeathData] = useState();
   const [testData, setTestData] = useState();
   const [responseData, setResponseData] = useState();
   const [isDataFound, setIsDataFound] = useState(false);
 
   useEffect(() => {
     fetchApi();
   }, []);
 
   useEffect(()=>{
     if(search?.length === 0 ){
       setIsDataFound(false);
     setResponseData('');
       setCaseData('');
       setDeathData('');
       setTestData('');
     }
   },[search])
 
   const fetchApi = async () => {
     const url = "https://covid-193.p.rapidapi.com/statistics";
 
     const response = await fetch(url, {
       headers: {
         "x-rapidapi-host": "covid-193.p.rapidapi.com",
         "x-rapidapi-key": "f360ecb18dmsh9d9fe69cc80e353p1673e8jsnf0bccc3f012c",
       },
     });
 
     const result = await response.json();
     setCountryData(result.response);
   };
 
   const countryInfo = countryData?.map((item) => ({
     name: item?.country,
     population: item?.population,
     totalCases: item?.cases.total,
     continent: item?.continent,
   }));
 
   const handleSearch = async () => {
     setIsDataFound(false);
     const url = `https://covid-193.p.rapidapi.com/statistics?country=${search}`;
     const response = await fetch(url, {
       headers: {
         "x-rapidapi-host": "covid-193.p.rapidapi.com",
         "x-rapidapi-key": "f360ecb18dmsh9d9fe69cc80e353p1673e8jsnf0bccc3f012c",
       },
     });
     const result = await response.json();
     if (result?.results === 1) {
       setResponseData(result.response[0]);
       setCaseData(result.response[0].cases);
       setDeathData(result.response[0].deaths);
       setTestData(result.response[0].tests);
       setIsDataFound(false);
     } else {
       setIsDataFound(true);
     }
   };
 
   const handleContinentClick = (continentName) => {
     setSelectedContinent(continentName);
   };
 
   const handleClearSearch = () => {
     setSearch("");
     setIsDataFound(false);
     setResponseData('');
       setCaseData('');
       setDeathData('');
       setTestData('');
   };
 
   return (
     <>
       <div className="mainWrapper">
         <div className="header">
           <h1>Kriyadocs Coding assignment</h1>
           <h2>Covid Traker Dashboard</h2>
         </div>
         <div className="gridContainer">
           <div className="grid-item">
             <h2 className="table-header">
               Continent Name:- {selectedContinent}
             </h2>
             {selectedContinent && (
               <table className="countryTable">
                 <thead>
                   <tr>
                     <th>Country</th>
                     <th>Total Cases</th>
                     <th>Population</th>
                   </tr>
                 </thead>
                 <tbody>
                   {countryInfo
                     ?.filter(
                       (country) => country?.continent === selectedContinent
                     )
                     ?.map((country) => (
                       <tr key={country?.name}>
                         <td>{country?.name || "-"}</td>
                         <td>{country?.totalCases || "-"}</td>
                         <td>{country?.population || "-"}</td>
                       </tr>
                     ))}
                 </tbody>
               </table>
             )}
           </div>
           <div className="grid-item">
             <MapContainer
               className="map"
               center={[51.0, 19.0]}
               zoom={2}
               maxZoom={18}
             >
               <TileLayer
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
               />
               {Object.keys(continentalCoordinates)?.map((continent) => (
                 <CircleMarker
                   key={continent}
                   center={continentalCoordinates[continent]}
                   radius={20}
                   fillColor={continent === selectedContinent ? "red" : "blue"}
                   fillOpacity={0.8}
                   stroke={false}
                   eventHandlers={{
                     click: () => handleContinentClick(continent),
                   }}
                 >
                   <Popup>{continent}</Popup>
                 </CircleMarker>
               ))}
             </MapContainer>
           </div>
           <div className="grid-item">
             <h2 className="search-header">Search Country covid data</h2>
             <div className="search_wrapper">
               <input
                 className="searchbar"
                 placeholder="search.. eg.. China"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
                {search && (
                 <button className="clearSearchIconWrapper" onClick={handleClearSearch}>
                   X
                 </button>
               )}
               <button onClick={handleSearch} className="searchButton">
                 Search
               </button>
             </div>
             {isDataFound && search ? (
               <div className="noDataFoundWrapper">No Data Found for {search}</div>
             ) : (
               <div>
                 <h3>Country:- {responseData?.country || "-"}</h3>
                 <h3>Continent:- {responseData?.continent || "-"}</h3>
                 <h3>Total Population:- {responseData?.population || "-"}</h3>
                 <h3>Date:- {responseData?.day || "-"}</h3>
                 <h3>Total Case:- {caseData?.total || "-"}</h3>
                 <h3>Active Case:- {caseData?.active || "-"}</h3>
                 <h3>New Case:- {caseData?.new || "-"}</h3>
                 <h3>Critical Case:- {caseData?.critical || "-"}</h3>
                 <h3>Recovered Case:- {caseData?.recovered || "-"}</h3>
                 <h3>Total Deaths:- {deathData?.total || "-"}</h3>
                 <h3>New Deaths:- {deathData?.new || "-"}</h3>
                 <h3>Total Tests:- {testData?.total || "-"}</h3>
               </div>
             )}
           </div>
         </div>
       </div>
     </>
   );
 };
 
 export default Map;