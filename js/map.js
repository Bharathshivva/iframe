var map,mapClickHandler;

	require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer","esri/geometry/Extent", "esri/SpatialReference", "esri/dijit/BasemapLayer","esri/dijit/Basemap","esri/dijit/BasemapGallery", "esri/tasks/query",
		"esri/tasks/QueryTask","esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters","dojo/_base/array","esri/geometry/webMercatorUtils"
		], function (Map, ArcGISDynamicMapServiceLayer, Extent,SpatialReference,BasemapLayer,Basemap,BasemapGallery, Query, QueryTask,IdentifyTask, IdentifyParameters,arrayUtils,webMercatorUtils) {

        map = new Map("mapDiv", {
			basemap: "streets",
			showLabels: true,
			minZoom:4
        });

        var ind_ext = new Extent(66.62, 5.23, 98.87, 38.59, new SpatialReference({ wkid: 4326 }));

        //Takes a URL to a non cached map service.
        
		/*
		var basemapGallery = new BasemapGallery({
			showArcGISBasemaps: true,
			map: map
		}, "basemapGallery");
		basemapGallery.startup();
		  
		basemapGallery.on("error", function(msg) {
			console.log("basemap gallery error:  ", msg);
		}); */
		
		$('#basemaps').dialog({
			autoOpen : false,
			maxHeight:400,
			overflow:"auto"
		});
		
		$("#basemap_btn").click(function(){
			if(!$('#basemaps').dialog('isOpen')){
				$('#basemaps').dialog("open");
			}		
		});
		var adminlayer = new ArcGISDynamicMapServiceLayer(servicelist.admin.url+"?token="+servicelist.admin.token);

        map.addLayer(adminlayer);
		
		map.on("load", function () {
			BaseMaps_fun();
			//fillColorsdd();
			map.setExtent(ind_ext.expand(2));
			identifyTask = new IdentifyTask(servicelist.admin.url + "?token="+servicelist.admin.token);
            identifyParams = new IdentifyParameters();
            identifyParams.tolerance = 1;
            identifyParams.returnGeometry = true;
            identifyParams.layerIds = [2];
            identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
			filldropdowns(servicelist.admin.url + "/0?token="+servicelist.admin.token, "statedd", ["STNAME", "STCODE11"], "STNAME", "Select State", "1=1");
			
        });
		
		function BaseMaps_fun(){
			var basemaps = [];
			for(var i=0;i<servicelist.basemaps.length;i++){
				var base=servicelist.basemaps[i];
				var nicsbasemap = new Basemap({
					layers: [new BasemapLayer({
						url: base.url
					})],
					title: base.title,
					thumbnailUrl: base.thumbnailUrl
				});
				basemaps.push(nicsbasemap);
			}
			var basemapGallery = new BasemapGallery({
				showArcGISBasemaps: false,
				basemaps: basemaps,
				map: map
			}, "basemapGallery");
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
            });
        }
		
		function zoombasedondropdown(url, condition) {
            var qt = new QueryTask(url);
            var q = new Query();
            q.returnGeometry = true;
            //q.outFields = ["*"];
            //q.outSpatialReference = { wkid: 102100 };
            q.where = condition;
            qt.execute(q, function (fset) {
                map.setExtent(fset.features[0].geometry.getExtent(), true);
            }, function (error) {
                console.log("ZoomError " + error);
            });

        }
		
		$("#statedd").change(function () {
            var selectedvalue = this.value;
            connectClickEvent(false);
            if (selectedvalue === "select") {
                adminlayer.setDefaultLayerDefinitions();
                map.setExtent(ind_ext.expand(2));
               // districtclear();
                //subdistrictclear();
            }
            else {
                var layerDefinitions = [];
                layerDefinitions[0] = "stcode11='" + selectedvalue + "'";
                layerDefinitions[1] = "stcode11='" + selectedvalue + "'";
                layerDefinitions[2] = "stcode11='" + selectedvalue + "'";
                layerDefinitions[3] = "stcode11='" + selectedvalue + "'";
                adminlayer.setLayerDefinitions(layerDefinitions);
                filldropdowns(servicelist.admin.url + "/1?token="+servicelist.admin.token, "districtdd", ["dtname", "dtcode11"], "dtname", "Select District", "stcode11='" + selectedvalue + "'");
                zoombasedondropdown(servicelist.admin.url + "/0?token="+servicelist.admin.token, "STCODE11='" + selectedvalue + "'");
            }
        });
		
		$("#districtdd").change(function () {
            var selectedvalue = this.value;
            connectClickEvent(false);
            var selectedstate = $("#statedd").val();
            var layerDefinitions = [];
            if (selectedvalue === "select") {
                layerDefinitions[0] = "stcode11='" + selectedstate + "'";
                layerDefinitions[1] = "stcode11='" + selectedstate + "'";
                layerDefinitions[2] = "stcode11='" + selectedstate + "'";
                layerDefinitions[3] = "stcode11='" + selectedstate + "'";
                adminlayer.setLayerDefinitions(layerDefinitions);
                zoombasedondropdown(servicelist.admin.url + "/0?token="+servicelist.admin.token, "stcode11='" + selectedstate + "'");
            }
            else {
                layerDefinitions[0] = "dtcode11='" + selectedvalue + "'";
                layerDefinitions[1] = "dtcode11='" + selectedvalue + "'";
                layerDefinitions[2] = "dtcode11='" + selectedvalue + "'";
                layerDefinitions[3] = "dtcode11='" + selectedvalue + "'";
                adminlayer.setLayerDefinitions(layerDefinitions);
                filldropdowns(servicelist.admin.url + "/2?token="+servicelist.admin.token, "blockdd", ["sdtname", "sdtcode11"], "sdtname", "Select Sub Dist.", "dtcode11='" + selectedvalue + "'");
                zoombasedondropdown(servicelist.admin.url + "/1?token="+servicelist.admin.token, "dtcode11='" + selectedvalue + "'");
            }
        });
		
		$("#blockdd").change(function () {
            var selectedvalue = this.value;
			connectClickEvent(false);
           
            var selecteddist = $("#districtdd").val();
            var layerDefinitions = [];
            if (selectedvalue === "select") {
                layerDefinitions[0] = "dtcode11='" + selecteddist + "'";
                layerDefinitions[1] = "dtcode11='" + selecteddist + "'";
                layerDefinitions[2] = "dtcode11='" + selecteddist + "'";
                layerDefinitions[3] = "dtcode11='" + selecteddist + "'";
                adminlayer.setLayerDefinitions(layerDefinitions);
                zoombasedondropdown(servicelist.admin.url + "/1?token="+servicelist.admin.token, "dtcode11='" + selecteddist + "'");
            }
            else {
				connectClickEvent(true);
                layerDefinitions[0] = "sdtcode11='" + selectedvalue + "'";
                layerDefinitions[1] = "sdtcode11='" + selectedvalue + "'";
                layerDefinitions[2] = "sdtcode11='" + selectedvalue + "'";
                layerDefinitions[3] = "sdtcode11='" + selectedvalue + "'";
                adminlayer.setLayerDefinitions(layerDefinitions);
                zoombasedondropdown(servicelist.admin.url + "/2?token="+servicelist.admin.token, "sdtcode11='" + selectedvalue + "'");
            }
        });
		
		function connectClickEvent(value) {
			if (value) {
				mapClickHandler = map.on("click", executeIdentifyTask);
			}
			else {
				if (mapClickHandler) {
					mapClickHandler.remove();
				}
			}
		}
		
		//Identify
        function executeIdentifyTask(evt) {
            identifyParams.geometry = evt.mapPoint;
            identifyParams.mapExtent = map.extent;
            var results = identifyTask.execute(identifyParams).addCallback(function (fset) {
                return arrayUtils.map(fset, function (result) {
                    //var defaulttitle=result.layerName;
					console.log(result.feature.attributes);
					var normalizedVal = webMercatorUtils.xyToLngLat(evt.mapPoint.x, evt.mapPoint.y);
					console.log(normalizedVal); //returns 19.226, 11.789
					var att=result.feature.attributes;
					var content="<table>";
					content+="<tr><td>State</td><td>"+att.stname+"</td></tr>";
					content+="<tr><td>District</td><td>"+att.dtname+"</td></tr>";
					content+="<tr><td>Sub Dist</td><td>"+att.sdtname+"</td></tr>";
					content+="<tr><td>Lat-Long</td><td>"+normalizedVal[0] +"-"+normalizedVal[1]+"</td></tr>";
					content+="</table>";
					$("#dialog").empty();
					$("#dialog").append(content);
                    
					$("#dialog").dialog();
					return result;
                });

            });
			//console.log(results);
			
           // map.infoWindow.setFeatures([results]);
            //map.infoWindow.show(evt.mapPoint);
           // identify_layer.hide();
           // distance_graphlayer.hide();
           // $('#distancepanel').css('display', "none");
        }
		
		function click(){
			$("#dialog").dialog();
		}
	
	
	});