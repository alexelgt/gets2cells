/*==== Set global variables ====*/
/*==== Data ====*/
var data_global_gyms;
var gyms_data;
/*== Data ==*/

/*==== Strings ====*/
var kml_string_grid1 = "";
var kml_string_grid2 = "";
/*== Strings ==*/

/*==== States ====*/
var problems_with_gyms = false;

var current_mode = "Points";
/*== States ==*/

/*==== Cells info ====*/
var level_grid1 = parseInt(document.getElementById("level_grid1").value);
var level_grid2 = parseInt(document.getElementById("level_grid2").value);

var point1_input = document.getElementById("point1").value.split(",");
var point2_input = document.getElementById("point2").value.split(",");
/*== Cells info ==*/

/*=== Other ===*/
var offset = {lat: -1e-5, lng: 1e-5};
/*== Set global variables ==*/

/*==== Function that gets the 2 grids and kml strings ====*/
function getGrids() {

    document.getElementById("Output_working").style.display = "block";

    setTimeout(function() {
        /*=== Set points from the inputs ===*/
        var [point1_grid1, point2_grid1] = setGridPoints(point1_input, point2_input);

        /*==== Set styles for the grids ====*/
        var grid_style1 = {color: "ff0000ff", width: "2.5"};
        var grid_style2 = {color: "ffd18802", width: "1.0"};
        /*== Set styles for the grids ==*/
    
        /*=== Get grid 1 ===*/
        // point1_innergrid, point2_innergrid are used to obtain grid 2
        var [horizontal_lines_grid1, vertical_lines_grid1, point1_innergrid, point2_innergrid] = getLines(point1_grid1, point2_grid1, level_grid1);

        /*=== Get grid 2 ===*/
        var [horizontal_lines_grid2, vertical_lines_grid2] = getLines(point1_innergrid, point2_innergrid, level_grid2);

        /*==== Get kml strings ====*/
        kml_string_grid1 = writeKmlFile(horizontal_lines_grid1, vertical_lines_grid1, grid_style1, level_grid1);
        kml_string_grid2 = writeKmlFile(horizontal_lines_grid2, vertical_lines_grid2, grid_style2, level_grid2);
        /*== Get kml strings ==*/

        /*==== Show download buttons ====*/
        if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
            document.getElementsByClassName("download_buttons")[0].innerHTML = "<button id='btngetexandblockedgyms' class='STRING_GET_S214' onclick='downloadGrid(" + 1 + ");'>Celdas S2 Nivel " + level_grid1 + "</button>"
                                                                             + "<button id='btngetexandblockedgyms' class='STRING_GET_S217' onclick='downloadGrid(" + 2 + ");'>Celdas S2 Nivel "+ level_grid2 + "</button>";
        }
        else {
            document.getElementsByClassName("download_buttons")[0].innerHTML = "<button id='btngetexandblockedgyms' class='STRING_GET_S214' onclick='downloadGrid(" + 1 + ");'>Level " + level_grid1 + " S2 Cells</button>"
                                                                             + "<button id='btngetexandblockedgyms' class='STRING_GET_S217' onclick='downloadGrid(" + 2 + ");'>Level "+ level_grid2 + " S2 Cells</button>";
        }
        document.getElementsByClassName("results_block")[0].style.display = 'block';
        /*== Show download buttons ==*/
      }, 0); // a set timeout is done so that html can be updated to show the text "Running..."

    setTimeout(function() {
        document.getElementById("Output_working").style.display = "none";
    }, 200); // artificial delay so that the text "Running..." is shown even when the code runs in a short time
}
/*== Function that gets the 2 grids and kml strings ==*/

function getCellCorners(point, level) {
    const cell = window.S2.S2Cell.FromLatLng(point, level);
    return cell.getCornerLatLngs();
}

/*==== Get distance of to points ====*/
function distance(point1, point2) {
    var lat1 = point1[0];
    var lng1 = point1[1];

    var lat2 = point2[0];
    var lng2 = point2[1];

    var R_earth = 6.371 * 1e3; //km
    var p = Math.PI / 180.0;
    var a = 0.5 - Math.cos((lat2 - lat1) * p) / 2.0 + 
            Math.cos(lat1 * p) * Math.cos(lat2 * p) * 
            (1.0 - Math.cos((lng2 - lng1) * p)) / 2.0;
  
    return 2.0 * R_earth * Math.asin(Math.sqrt(a));
}
/*== Get distance of to points ==*/

function getCorners(data) {
    corners_minlng = []
    corners_maxlng = []

    isFirstElement = true
    first_element = null
    for (data_value of data) {
        if (isFirstElement) {
            corners_minlng.push(data_value);
            first_element = data_value;
            isFirstElement = false;
        }
        else {
            if (data_value.lng == first_element.lng) {
                corners_minlng.push(data_value);
            }
            else {
                corners_maxlng.push(data_value);
            }
        }
    }

    corners_minlng_minandmax = getMaxMinLatLng(corners_minlng);
    corners_maxlng_minandmax = getMaxMinLatLng(corners_maxlng);

    return [{lat: corners_minlng_minandmax[0], lng: corners_minlng_minandmax[1]}, {lat: corners_minlng_minandmax[2], lng: corners_minlng_minandmax[1]}, {lat: corners_maxlng_minandmax[2], lng: corners_maxlng_minandmax[1]}, {lat: corners_maxlng_minandmax[0], lng: corners_maxlng_minandmax[1]}]
}

/*==== Get lines for the grid ====*/
function getLines(point1, point2, level) {
    var horizontal_lines = [];
    var vertical_lines = [];

    var isFirstLine = true;
    var isPoint2InsideCell = false;

    /*=== Get initial cell ===*/
    var corners = getCellCorners(point1, level);

    corners_fixed = getCorners(corners)

    /*==== Get references point ====*/
    // reference points are used for the smaller grids
    var reference_point = {lat: corners_fixed[1].lat + offset.lat, lng: corners_fixed[1].lng + offset.lng};
    var reference_point_next_line = {lat: corners_fixed[0].lat + offset.lat, lng: corners_fixed[0].lng + offset.lng};
    /*== Get references point ==*/

    var point1_innergrid = reference_point;

    point_to_analyze = reference_point;
    horizontal_line_point1 = corners_fixed[1];
    horizontal_line_point2 = corners_fixed[2];

    vertical_lines.push([corners_fixed[1], undefined]);

    /*==== loop rows ====*/
    do {
        horizontal_line_point1 = corners_fixed[1];
        horizontal_line_point2 = corners_fixed[2];
        /*==== loop columns ====*/
        do {
            corners = getCellCorners(point_to_analyze, level);
            corners_fixed = getCorners(corners)
            horizontal_line_point2 = corners_fixed[2];

            if (isFirstLine) {
                vertical_lines.push([corners_fixed[2], undefined]);
            }
    
            point_to_analyze = {lat: corners_fixed[2].lat + offset.lat, lng: corners_fixed[2].lng + offset.lng};
        } while (horizontal_line_point2.lng <= point2.lng);
        /*== loop columns ==*/

        if (isFirstLine) {
            isFirstLine = false;
        }
    
        horizontal_lines.push([horizontal_line_point1, horizontal_line_point2]);
    
        isPoint2InsideCell = S2.latLngToKey(corners_fixed[1].lat + offset.lat, corners_fixed[1].lng + offset.lng, level) == S2.latLngToKey(point2.lat, point2.lng, level);
    
        point_to_analyze = reference_point_next_line;
    
        corners = getCellCorners(point_to_analyze, level);
        corners_fixed = getCorners(corners)
        reference_point_next_line = {lat: corners_fixed[0].lat + offset.lat, lng: corners_fixed[0].lng + offset.lng};
    } while (!isPoint2InsideCell);
    /*== loop rows ==*/

    /*==== Last row ====*/
    horizontal_line_point1 = corners_fixed[1];
    horizontal_line_point2 = corners_fixed[2];

    vertical_lines[0][1] = corners_fixed[1];

    var vertical_index = 1;
    /*==== loop columns ====*/
    do {
        corners = getCellCorners(point_to_analyze, level);
        corners_fixed = getCorners(corners)
        horizontal_line_point2 = corners_fixed[2];

        vertical_lines[vertical_index][1] = corners_fixed[2];
        vertical_index++;

        point_to_analyze = {lat: corners_fixed[2].lat + offset.lat, lng: corners_fixed[2].lng + offset.lng};
    } while (horizontal_line_point2.lng <= point2.lng);
    /*== loop columns ==*/

    horizontal_lines.push([horizontal_line_point1, horizontal_line_point2]);
    /*== Last row ==*/

    var point2_innergrid = {lat: corners_fixed[2].lat - offset.lat, lng: corners_fixed[2].lng - offset.lng};

    return [horizontal_lines, vertical_lines, point1_innergrid, point2_innergrid]
}
/*== Get lines for the grid ==*/

/*==== Set grid points ====*/
function setGridPoints(point1_input, point2_input) {

    var point1;
    var point2;

    /*==== If mode is "Points" get the grid points from the input points ====*/
    if (current_mode == "Points" ) {
        point1 = {lat: parseFloat(point1_input[0]), lng: parseFloat(point1_input[1])};
        point2 = {lat: parseFloat(point2_input[0]), lng: parseFloat(point2_input[1])};
    
        /*==== Make sure the points have the correct set up ====*/
        // getLines() goes from left to right and top to bottom
        // if the points are not set in such a way that makes it possible to do that, getLines() will end up in an infinite loop
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
        /*== Make sure the points have the correct set up ==*/
    }
    /*== If mode is "Points" get the grid points from the input points ==*/

    /*==== If mode is "Gyms" get the grid points from the gyms coordinates ====*/
    if (current_mode == "Gyms" ) {

        
        var [min_lat, min_lng, max_lat, max_lng] = getMaxMinLatLng(gyms_data);

        point1 = {lat: max_lat, lng: min_lng};
        point2 = {lat: min_lat, lng: max_lng};
    }
    /*== If mode is "Gyms" get the grid points from the gyms coordinates ==*/

    return [point1, point2];
}
/*== Set grid points ==*/