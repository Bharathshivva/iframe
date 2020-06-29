var map;

	require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer","esri/geometry/Extent", "esri/SpatialReference", "esri/dijit/BasemapLayer","esri/dijit/Basemap","esri/dijit/BasemapGallery", "esri/tasks/query",
		"esri/tasks/QueryTask"
		], function (Map, ArcGISDynamicMapServiceLayer, Extent,SpatialReference,BasemapLayer,Basemap,BasemapGallery, Query, QueryTask) {

        map = new Map("mapDiv", {
			basemap: "streets",
			showLabels: true,
			minZoom:4
        });

        var ind_ext = new Extent(66.62, 5.23, 98.87, 38.59, new SpatialReference({ wkid: 4326 }));

        //Takes a URL to a non cached map service.
        var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(servicelist.admin.url+"?token="+servicelist.admin.token);

        map.addLayer(dynamicMapServiceLayer);
		
		map.on("load", function () {
			//BaseMaps();
			//fillColorsdd();
			map.setExtent(ind_ext.expand(2));
			filldropdowns(servicelist.admin.url + "/0?token="+servicelist.admin.token, "statedd", ["STNAME", "STCODE11"], "STNAME", "Select State", "1=1");
			
        });
		
		function basemap(){
			var basemaps = [];
			var nicstreetlayer = new BasemapLayer({
				url: ""
			});
			var nicstreetbasemap = new Basemap({
				layers: [nicstreetlayer],
				title: "NIC Street",
				thumbnailUrl: "images/basemapimages/Street.png"
			});
			basemaps.push(nicstreetbasemap);

			var nobasemaplayer = new BasemapLayer({
				url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
			});
			var nobasemap = new Basemap({
				layers: [nobasemaplayer],
				title: "India",
				thumbnailUrl: "images/basemapimages/Satellite.png"
			});
			basemaps.push(nobasemap);
			var basemapGallery = new BasemapGallery({
				showArcGISBasemaps: false,
				basemaps: basemaps,
				map: map
			}, basemapdiv);
			basemapGallery.on("error", function (msg) {
				console.log("basemap gallery error:  ", msg);
				basemapGallery.select("basemap_1");
			});
			basemapGallery.startup();
			basemapGallery.select("basemap_0");
		}
	
		function filldropdowns(url, id, fields, orderby, defaulttext, condition) {
            var query = new Query();
            query.where = condition;
            query.outFields = fields;
            query.orderByFields = [orderby];
            var queryTask = new QueryTask(url);
            queryTask.execute(query, function (fset) {
                $("#" + id).empty();
                $("#" + id).append(new Option(defaulttext, "select"));
                fset = fset.features;
                if (fset.length > 0) {
                    for (var i = 0; i < fset.length; i++) {
                        $("#" + id).append(new Option(fset[i].attributes[fields[0]], fset[i].attributes[fields[1]]));
                    }
                }
                $("#aoiloader").css("display", "none");
            });
        }
	
	
	});