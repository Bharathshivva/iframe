var servicelist={
	admin:{
		url:"https://mapservice.gov.in/gismapservice/rest/services/BharatMapService/Admin_Boundary_Village/MapServer",
		token:"D2h7FO-jerNZxqI_5w17lpkwt5aeVo7cDxfrebNPl11xzcvJHcdtyEsSi6Q1Ryn6"
	},
	basemaps:[
		{
			url:"https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer",
			title:"ESRI Street",
			defaultenable:true,			
			opacity:1,
			thumbnailUrl:"images/basemapimages/Street.png"
		},
		{
			url:"https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer",
			title:"ESRI Imagery",
			defaultenable:false,
			opacity:1,
			thumbnailUrl:"images/basemapimages/Satellite.png"
		},
		{
			url:"https://mapservice.gov.in/mapserviceserv176/rest/services/Street/StreetMap/MapServer?token=M9nM5SBglQZ2i7nK9ZXY3XUM3-pc8uGIvVTP2q61-pb_sm9wwA6ZoUwtMO3pFaG6",
			title:"ESRI Imagery",
			defaultenable:false,
			opacity:1,
			thumbnailUrl:"images/basemapimages/NIC_Street.png"
		}
	]
};

