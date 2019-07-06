var data_global_gyms;
var gyms_data;

var problems_with_gyms = false;

var current_mode = "Points";

var level_grid1 = parseInt(document.getElementById("level_grid1").value);
var level_grid2 = parseInt(document.getElementById("level_grid2").value);

var point1_input = document.getElementById("point1").value.split(",");
var point2_input = document.getElementById("point2").value.split(",");

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

    isThereAnyError();
}

function updateInLevelGrid2() {
    level_grid2 = parseInt(document.getElementById("level_grid2").value);

    isThereAnyError();
    
}

function updateInPoint1() {
    point1_input = document.getElementById("point1").value.split(",");
    
    isThereAnyError();
    document.getElementById("Output_text_info").innerHTML = "";
}

function updateInPoint2() {
    point2_input = document.getElementById("point2").value.split(",");

    isThereAnyError();
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

/*==== Gyms ====*/
function handleFilegyms (evt) {
    const fr_gyms = new FileReader();
    fr_gyms.readAsText(evt.target.files[0]);

    output_filename = evt.target.files[0].name.replace('.csv', '').replace('.txt', '');

    fr_gyms.onload = e => {
        data_global_gyms = (e.target.result);
        gyms_data = JSON.parse(csvJSON(data_global_gyms));

        /*==== Check if any of the rows contains valid data ====*/
        problems_with_gyms = false;
        anyValidGym = removeProblematicGymRows(); // this function returns the number of valid gyms

        if (!anyValidGym) {
            if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
                document.getElementById("Output_error_gyms").innerHTML = "• Ninguno de los gimnasios es válido . Por favor, seleccione un archivo válido.<br>";
            }
            else {
                document.getElementById("Output_error_gyms").innerHTML = "• None of the gyms are valid. Please, select a valid file.<br>";
            }
            document.getElementById("Output_error_orange").innerHTML = "";
            document.getElementsByClassName("results_block")[0].style.display = 'none';
            throw new Error("None of the gyms are valid");
        }
        else {
            document.getElementById("Output_error_gyms").innerHTML = "";
            isThereAnyError();
        }
        /*== Check if any of the rows contains valid data ==*/
        
    };
};
/*== Gyms ==*/

document.getElementById('level_grid1').addEventListener('change', updateInLevelGrid1, false);
document.getElementById('level_grid2').addEventListener('change', updateInLevelGrid2, false);

document.getElementById('point1').addEventListener('change', updateInPoint1, false);
document.getElementById('point2').addEventListener('change', updateInPoint2, false);

document.getElementById('point1').addEventListener('input', showPressIntro, false);
document.getElementById('point2').addEventListener('input', showPressIntro, false);

document.getElementById('gymsfile').addEventListener('change', handleFilegyms, false);


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
            document.getElementsByClassName("download_buttons")[0].innerHTML = "<button id='btngetexandblockedgyms' class='STRING_GET_S214' onclick='downloadGrid(" + 1 + ");'>Level " + level_grid1 + " S2 Cells</button>"
                                                                             + "<button id='btngetexandblockedgyms' class='STRING_GET_S217' onclick='downloadGrid(" + 2 + ");'>Level "+ level_grid2 + " S2 Cells</button>";
        }
        document.getElementsByClassName("results_block")[0].style.display = 'block';
      }, 0);

    setTimeout(function() {
        document.getElementById("Output_working").style.display = "none";
    }, 200);

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

    var point1;
    var point2;

    if (current_mode == "Points" ) {
        point1 = {lat: parseFloat(point1_input[0]), lng: parseFloat(point1_input[1])};
        point2 = {lat: parseFloat(point2_input[0]), lng: parseFloat(point2_input[1])};
    
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
    }
    if (current_mode == "Gyms" ) {

        var [min_lat, min_lng, max_lat, max_lng] = getMaxMinLatLng();

        point1 = {lat: max_lat, lng: min_lng};
        point2 = {lat: min_lat, lng: max_lng};
    }
    
    
    return [point1, point2];
}

function downloadGrid(grid) {
    if (grid == 1) {
        downloadOutputFile(kml_string_grid1, "kml", "Level" + level_grid1 + "S2Cells")
    }
    else if (grid == 2) {
        downloadOutputFile(kml_string_grid2, "kml", "Level" + level_grid2 + "S2Cells")
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
        if (point == "") {
            if (point_number == 1) {
                point1_input = point2_input
            }
            else if (point_number == 2) {
                point2_input = point1_input
            }
        }
        else {
            isPointValid = false;
        }

        if (document.getElementById("point1").value == "" && document.getElementById("point2").value == "") {
            if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
                document.getElementById("Output_error_red").innerHTML = "• Introduce las coordenadas de al menos un punto.";
            }
            else {
                document.getElementById("Output_error_red").innerHTML = "• Put the coordinates of at least one point.";
            }
            point1_input = document.getElementById("point1").value;
            point2_input = document.getElementById("point2").value;

            isPointValid = false;
        }
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
        document.getElementsByClassName("error_block")[0].style.display = 'none';
        document.getElementById("Output_error_red").innerHTML = "";
    }
    else {
        document.getElementsByClassName("results_block")[0].style.display = 'none';
        document.getElementsByClassName("error_block")[0].style.display = 'block';
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
        document.getElementsByClassName("error_block")[0].style.display = 'none';
        document.getElementById("Output_error_red").innerHTML = "";
    }
    else {
        document.getElementsByClassName("results_block")[0].style.display = 'none';
        document.getElementsByClassName("error_block")[0].style.display = 'block';
    }

    return isSafeToGetGrid;
}

function isThereAnyError() {
    var errorGyms = document.getElementById("Output_error_gyms").textContent;
    var errorOrange = document.getElementById("Output_error_orange").textContent;
    var errorRed = document.getElementById("Output_error_red").textContent;


    if (current_mode == "Points") {
        if (checkIfValidPoint(point1_input, 1) && checkIfValidPoint(point2_input, 2) && safeToGetGrid()) {
            getGrids();
        }
    }
    if (current_mode == "Gyms") {
        if (gyms_data != undefined) {
            document.getElementById("Output_error_red").style.display = 'block';
            if (errorGyms != "" || errorOrange != "" || errorRed != "") {
                document.getElementsByClassName("error_block")[0].style.display = 'block';
            }
            else if ( errorGyms == "" && errorOrange == "" && errorRed == "") {
                document.getElementsByClassName("error_block")[0].style.display = 'none';
                document.getElementsByClassName("results_block")[0].style.display = 'block';
            }
    
            if (errorGyms == "" && errorRed == "") {
                document.getElementsByClassName("results_block")[0].style.display = 'block';
                getGrids();
            }
            if (errorGyms != "" || errorRed != "") {
                document.getElementsByClassName("results_block")[0].style.display = 'none';
            }
        }
    }
}