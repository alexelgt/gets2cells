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