/*==== Level Grids ====*/
function updateInLevelGrid1() {
    /*=== Update level grid 1 ===*/
    level_grid1 = parseInt(document.getElementById("level_grid1").value);

    /*==== Update level grid 2 options ====*/
    // Grid 2 is treated as a subgrid so level grid 2 must be higher than level grid 1
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
    /*== Update level grid 2 options ==*/

    isThereAnyError();
}

function updateInLevelGrid2() {
    /*=== Update level grid 2 ===*/
    level_grid2 = parseInt(document.getElementById("level_grid2").value);

    isThereAnyError();
}

document.getElementById('level_grid1').addEventListener('change', updateInLevelGrid1, false);
document.getElementById('level_grid2').addEventListener('change', updateInLevelGrid2, false);
/*== Level Grids ==*/

/*==== Points ====*/
function updateInPoint1() {
    /*=== Update point 2 ===*/
    point1_input = document.getElementById("point1").value.split(",");

    changePressIntroText();
    isThereAnyError();
}

function updateInPoint2() {
    /*=== Update point 2 ===*/
    point2_input = document.getElementById("point2").value.split(",");

    changePressIntroText();
    isThereAnyError();
}

document.getElementById('point1').addEventListener('change', updateInPoint1, false);
document.getElementById('point2').addEventListener('change', updateInPoint2, false);
/*== Points ==*/

/*==== Press Intro Message ====*/
function changePressIntroText() {
    let intro_text = document.getElementById("Output_text_info").style.display;

    if (intro_text == "none") {
        document.getElementById("Output_text_info").style.display = "block";
    }
    else {
        document.getElementById("Output_text_info").style.display = "none";
    }
}

document.getElementById('point1').addEventListener('input', changePressIntroText, false);
document.getElementById('point2').addEventListener('input', changePressIntroText, false);
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