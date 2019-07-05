// 40.57618, -4.0972290

var level_grid1 = parseInt(document.getElementById("level_grid1").value);
var level_grid2 = parseInt(document.getElementById("level_grid2").value);

var point1_input = document.getElementById("point1").value.split(",");
var point2_input = document.getElementById("point2").value.split(",");
debugger
var kml_string_grid1 = "";
var kml_string_grid2 = "";

var offset = {lat: -1e-5, lng: 1e-5};

getGrids();

function updateInLevelGrid1() {

    level_grid1 = parseInt(document.getElementById("level_grid1").value);

    document.getElementById("level_grid2").innerHTML = '';

    if (!(level_grid2 > level_grid1 && level_grid2 <= 20)) {
        level_grid2 = level_grid1 + 1;
    }

    for (let i = level_grid1 + 1; i <= 20; i++) {
        if (i == level_grid2) {
            document.getElementById("level_grid2").innerHTML += "<option selected>" + i + "</option>";
        }
        else {
            document.getElementById("level_grid2").innerHTML += "<option>" + i + "</option>";
        }
    }

    if (checkIfValidPoint(point1_input, 1) && safeToGetGrid()) {
        getGrids();
    }
}

function updateInLevelGrid2() {
    level_grid2 = parseInt(document.getElementById("level_grid2").value);

    if (checkIfValidPoint(point1_input, 1) && safeToGetGrid()) {
        getGrids();
    }
    
}

function updateInPoint1() {
    point1_input = document.getElementById("point1").value.split(",");
    
    if (checkIfValidPoint(point1_input, 1) && safeToGetGrid()) {
        getGrids();
    }
    document.getElementById("Output_text_info").innerHTML = "";
}

function updateInPoint2() {
    point2_input = document.getElementById("point2").value.split(",");

    if (checkIfValidPoint(point2_input, 2) && safeToGetGrid()) {
        getGrids();
    }
    document.getElementById("Output_text_info").innerHTML = "";
}

function showPressIntro() {
    if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
        document.getElementById("Output_text_info").innerHTML = "Pulsa Intro para actualizar"
    }
    else {
        document.getElementById("Output_text_info").innerHTML = "Press Intro to update"
    }
}

document.getElementById('level_grid1').addEventListener('change', updateInLevelGrid1, false);
document.getElementById('level_grid2').addEventListener('change', updateInLevelGrid2, false);

document.getElementById('point1').addEventListener('change', updateInPoint1, false);
document.getElementById('point2').addEventListener('change', updateInPoint2, false);

document.getElementById('point1').addEventListener('input', showPressIntro, false);
document.getElementById('point2').addEventListener('input', showPressIntro, false);


function getGrids() {

    document.getElementById("Output_working").style.display = "block";

    setTimeout(function() {
        var [point1_grid1, point2_grid1] = handleInputPoints(point1_input, point2_input);

        var grid_style1 = {color: "ff0000ff", width: "2.5"};
        var grid_style2 = {color: "ffd18802", width: "1.0"};
    
        var [horizontal_lines_grid1, vertical_lines_grid1, point1_innergrid, point2_innergrid] = getLines(point1_grid1, point2_grid1, level_grid1);
        var [horizontal_lines_grid2, vertical_lines_grid2] = getLines(point1_innergrid, point2_innergrid, level_grid2);
    
        kml_string_grid1 = writeKmlFile(horizontal_lines_grid1, vertical_lines_grid1, grid_style1, level_grid1);
        kml_string_grid2 = writeKmlFile(horizontal_lines_grid2, vertical_lines_grid2, grid_style2, level_grid2);
    
        if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
            document.getElementsByClassName("download_buttons")[0].innerHTML = "<button id='btngetexandblockedgyms' class='STRING_GET_S214' onclick='downloadGrid(" + 1 + ");'>Celdas S2 Nivel " + level_grid1 + "</button>"
                                                                             + "<button id='btngetexandblockedgyms' class='STRING_GET_S217' onclick='downloadGrid(" + 2 + ");'>Celdas S2 Nivel "+ level_grid2 + "</button>";
        }
        else {
            document.getElementsByClassName("download_buttons")[0].innerHTML = "<button id='btngetexandblockedgyms' class='STRING_GET_S214' onclick='downloadGrid(" + 1 + ");'>S2 Cells Level " + level_grid1 + "</button>"
                                                                             + "<button id='btngetexandblockedgyms' class='STRING_GET_S217' onclick='downloadGrid(" + 2 + ");'>S2 Cells Level "+ level_grid2 + "</button>";
        }
        document.getElementsByClassName("results_block")[0].style.display = 'block';
        document.getElementById("Output_working").style.display = "none";
      }, 100);

    
}

function getCellCorners(point, level) {
    const cell = window.S2.S2Cell.FromLatLng(point, level);
    return cell.getCornerLatLngs();
}

function getLines(point1, point2, level) {
    var horizontal_lines = [];
    var vertical_lines = [];

    var isFirstLine = true;
    var isPoint2InsideCell = false;

    /*=== Get initial cell ===*/
    var corners = getCellCorners(point1, level);

    /*==== Get references point ====*/
    // reference points are used for the smaller grids
    var reference_point = {lat: corners[1].lat + offset.lat, lng: corners[1].lng + offset.lng};
    var reference_point_next_line = {lat: corners[0].lat + offset.lat, lng: corners[0].lng + offset.lng};
    /*== Get references point ==*/

    var point1_innergrid = reference_point;

    point_to_analyze = reference_point;
    horizontal_line_point1 = corners[1];
    horizontal_line_point2 = corners[2];

    vertical_lines.push([corners[1], undefined]);

    /*==== loop rows ====*/
    do {
        horizontal_line_point1 = corners[1];
        horizontal_line_point2 = corners[2];
        /*==== loop columns ====*/
        do {
            corners = getCellCorners(point_to_analyze, level);
            horizontal_line_point2 = corners[2];
    
            if (isFirstLine) {
                vertical_lines.push([corners[2], undefined]);
            }
    
            point_to_analyze = {lat: corners[2].lat + offset.lat, lng: corners[2].lng + offset.lng};
        } while (horizontal_line_point2.lng <= point2.lng);
        /*== loop columns ==*/

        if (isFirstLine) {
            isFirstLine = false;
        }
    
        horizontal_lines.push([horizontal_line_point1, horizontal_line_point2]);
    
        isPoint2InsideCell = S2.latLngToKey(corners[1].lat + offset.lat, corners[1].lng + offset.lng, level) == S2.latLngToKey(point2.lat, point2.lng, level);
    
        point_to_analyze = reference_point_next_line;
    
        corners = getCellCorners(point_to_analyze, level);
        reference_point_next_line = {lat: corners[0].lat + offset.lat, lng: corners[0].lng + offset.lng};
    } while (!isPoint2InsideCell);
    /*== loop rows ==*/

    /*==== Last row ====*/
    horizontal_line_point1 = corners[1];
    horizontal_line_point2 = corners[2];

    vertical_lines[0][1] = corners[1];
    

    var vertical_index = 1;
    /*==== loop columns ====*/
    do {
        corners = getCellCorners(point_to_analyze, level);
        horizontal_line_point2 = corners[2];

        vertical_lines[vertical_index][1] = corners[2];
        vertical_index++;

        point_to_analyze = {lat: corners[2].lat + offset.lat, lng: corners[2].lng + offset.lng};
    } while (horizontal_line_point2.lng <= point2.lng);
    /*== loop columns ==*/

    horizontal_lines.push([horizontal_line_point1, horizontal_line_point2]);
    /*== Last row ==*/

    var point2_innergrid = {lat: corners[2].lat - offset.lat, lng: corners[2].lng - offset.lng};

    return [horizontal_lines, vertical_lines, point1_innergrid, point2_innergrid]
}

function writeKmlFile(horizontal_lines, vertical_lines, grid_style, level) {

    var kml_string = "";
    var kml_string_name = "";
    var kml_string_zone = "";
    if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
        kml_string_name = "\n            <name>Celdas S2 Nivel " + level + "</name>";
        kml_string_zone = "\n                <name>Zona 1</name>";
    }
    else {
        kml_string_name = "\n            <name>S2 Cells Level " + level + "</name>";
        kml_string_zone = "\n                <name>Zone 1</name>";
    }
    var kml_string_text1 = "<?xml version='1.0' encoding='utf-8' ?>"
                         + "\n<kml xmlns='http://www.opengis.net/kml/2.2'>"
                         + "\n    <Document id='root_doc'>"
                         + "\n        <Schema name='OGRGeoJSON' id='OGRGeoJSON'>"
                         + "\n            <SimpleField name='fill-opacity' type='float'></SimpleField>"
                         + "\n            <SimpleField name='stroke-width' type='int'></SimpleField>"
                         + "\n        </Schema>"
                         + "\n        <Folder>"
                         + kml_string_name
                         + "\n            <Placemark>"
                         + kml_string_zone
                         + "\n                <Style>"
                         + "\n                    <LineStyle>"
                         + "\n                        <color>" + grid_style.color + "</color>"
                         + "\n                        <width>" + grid_style.width + "</width>"
                         + "\n                    </LineStyle>"
                         + "\n                    <PolyStyle>"
                         + "\n                        <fill>0</fill>"
                         + "\n                    </PolyStyle>"
                         + "\n                </Style>"
                         + "\n                <MultiGeometry>";

    var kml_string_text2 = "\n                </MultiGeometry>"
                         + "\n            </Placemark>"
                         + "\n        </Folder>"
                         + "\n    </Document>"
                         + "\n</kml>";

    kml_string = kml_string_text1;

    for (const line of vertical_lines) {
        kml_string += "\n                    <LineString>"
                    + "\n                        <coordinates>"
                    + line[0].lng + ", " + line[0].lat + " " + line[1].lng + ", " + line[1].lat
                    + "</coordinates>"
                    + "\n                    </LineString>";
    }

    for (const line of horizontal_lines) {
        kml_string += "\n                    <LineString>"
                    + "\n                        <coordinates>"
                    + line[0].lng + ", " + line[0].lat + " " + line[1].lng + ", " + line[1].lat
                    + "</coordinates>"
                    + "\n                    </LineString>";
    }

    kml_string += kml_string_text2;

    return kml_string;
}

function handleInputPoints(point1_input, point2_input) {

    var point1 = {lat: parseFloat(point1_input[0]), lng: parseFloat(point1_input[1])};
    var point2 = {lat: parseFloat(point2_input[0]), lng: parseFloat(point2_input[1])};

    if (point1.lat < point2.lat) {
        var temp = point1.lat;

        point1.lat = point2.lat;
        point2.lat = temp;

    }

    if (point1.lng > point2.lng) {
        var temp = point1.lng;

        point1.lng = point2.lng;
        point2.lng = temp;
    }
    
    return [point1, point2];
}

function downloadGrid(grid) {
    if (grid == 1) {
        downloadOutputFile(kml_string_grid1, "kml", "S2CellsLevel14")
    }
    else if (grid == 2) {
        downloadOutputFile(kml_string_grid2, "kml", "S2CellsLevel17")
    }
}

function checkIfValidPoint(point, point_number) {
    var isPointValid = true;

    if ( ( point.length != 2 ) || ( isNaN(point[0]) || isNaN(point[1]) ) ) {
        if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
            document.getElementById("Output_error_red").innerHTML = "• Punto " + point_number + " no es valido.";
        }
        else {
            document.getElementById("Output_error_red").innerHTML = "• Point " + point_number + " not valid.";
        }
        isPointValid = false;
    }
    else {
        if (point[0] > 90.0 || point[0] < -90.0) {
            if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
                document.getElementById("Output_error_red").innerHTML = "• Punto " + point_number + " no tiene una latitud correcta.";
            }
            else {
                document.getElementById("Output_error_red").innerHTML = "• Point " + point_number + " does not have a correct latitude.";
            }
            isPointValid = false;
        }
        if (point[1] > 180.0 || point[1] < -180.0) {
            if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
                document.getElementById("Output_error_red").innerHTML = "• Punto " + point_number + " no tiene una longitud correcta.";
            }
            else {
                document.getElementById("Output_error_red").innerHTML = "• Point " + point_number + " does not have a correct longitude.";
            }
            isPointValid = false;
        }
    }

    if (isPointValid) {
        document.getElementsByClassName("results_block")[0].style.display = 'block';
        document.getElementsByClassName("errors_block")[0].style.display = 'none';
        document.getElementById("Output_error_red").innerHTML = "";
    }
    else {
        document.getElementsByClassName("results_block")[0].style.display = 'none';
        document.getElementsByClassName("errors_block")[0].style.display = 'block';
    }

    return isPointValid;
}



function distance(point1, point2) {

    var lat1 = point1[0];
    var lng1 = point1[1];

    var lat2 = point2[0];
    var lng2 = point2[1];

    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lng2 - lng1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

function safeToGetGrid() {
    var isSafeToGetGrid = true;

    if ( (level_grid1 <= 17 && level_grid2 <= 17) && distance(point1_input,point2_input) > 40.0 ) {
        if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
            document.getElementById("Output_error_red").innerHTML = "• Distancia entre los puntos es muy grande.";
        }
        else {
            document.getElementById("Output_error_red").innerHTML = "• Distance between the points is to high.";
        }
        isSafeToGetGrid = false;
    }
    else if ( (level_grid1 > 17 || level_grid2 > 17) && distance(point1_input,point2_input) > 20.0 ) {
        if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
            document.getElementById("Output_error_red").innerHTML = "• Distancia entre los puntos es muy grande.";
        }
        else {
            document.getElementById("Output_error_red").innerHTML = "• Distance between the points is to high.";
        }
        isSafeToGetGrid = false;
    }

    if (isSafeToGetGrid) {
        document.getElementsByClassName("results_block")[0].style.display = 'block';
        document.getElementsByClassName("errors_block")[0].style.display = 'none';
        document.getElementById("Output_error_red").innerHTML = "";
    }
    else {
        document.getElementsByClassName("results_block")[0].style.display = 'none';
        document.getElementsByClassName("errors_block")[0].style.display = 'block';
    }

    return isSafeToGetGrid;
}