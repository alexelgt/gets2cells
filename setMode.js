/*==== Deal with page style if select_mode is changed ====*/
function handleSelectedmode() {
    if ( current_mode == "Points" ) {
        document.getElementsByClassName("Points_area")[0].style.display = 'block';
        document.getElementsByClassName("Files_area")[0].style.display = 'none';
        isThereAnyError();
        
    }

    if ( current_mode == "Gyms" ) {
        document.getElementsByClassName("Points_area")[0].style.display = 'none';
        document.getElementsByClassName("Files_area")[0].style.display = 'block';
        if (gyms_data != undefined) {
            isThereAnyError();
        }
        else {
            document.getElementsByClassName("results_block")[0].style.display = 'none';
        }
    }
}
/*== Deal with page style if select_mode is changed ==*/

function setMode(mode,pressed_div) {

    var parentClass = pressed_div.parentNode.className;

    if (parentClass != "") {
        parentClass = "." + parentClass.replace(/ /g, '.');
    }

    /*==== Remove class "selected" from all elements ====*/
    var elems = document.querySelectorAll("#button_structure" + parentClass + " > div");

    [].forEach.call(elems, function(el) {
        el.classList.remove("selected");
    });
    /*== Remove class "selected" from all elements ==*/

    /*=== Add class "selected" to element who triggered the function ===*/
    pressed_div.classList.add("selected");

    changeModeVar(mode);

    function changeModeVar(mode,parentClass) {
        current_mode = mode;
    }
    handleSelectedmode();
}