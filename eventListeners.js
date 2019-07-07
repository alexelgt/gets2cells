/*==== Level Grids ====*/
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

document.getElementById('level_grid1').addEventListener('change', updateInLevelGrid1, false);
document.getElementById('level_grid2').addEventListener('change', updateInLevelGrid2, false);
/*== Level Grids ==*/

/*==== Points ====*/
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

document.getElementById('point1').addEventListener('change', updateInPoint1, false);
document.getElementById('point2').addEventListener('change', updateInPoint2, false);
/*== Points ==*/

/*==== Press Intro Message ====*/
function showPressIntro() {
    if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
        document.getElementById("Output_text_info").innerHTML = "Pulsa Intro para actualizar"
    }
    else {
        document.getElementById("Output_text_info").innerHTML = "Press Intro to update"
    }
}

document.getElementById('point1').addEventListener('input', showPressIntro, false);
document.getElementById('point2').addEventListener('input', showPressIntro, false);
/*== Press Intro Message ==*/

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

document.getElementById('gymsfile').addEventListener('change', handleFilegyms, false);
/*== Gyms ==*/