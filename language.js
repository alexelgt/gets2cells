/*========================================================
 * function that sets the strings for different languages
 *========================================================*/
function language(){

  if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
    document.getElementsByClassName("STRING_MODE")[0].innerText = "Modo"

    document.getElementsByClassName("STRING_POINTS")[0].innerHTML = "Puntos"
    document.getElementsByClassName("STRING_GYMS")[0].innerHTML = "Gimnasios"

    document.getElementsByClassName("STRING_FILES")[0].innerText = "Archivos"

    document.getElementsByClassName("STRING_GYMS_FILE")[0].innerHTML = 'Gimnasios: <span class="inputfile">seleccionar archivo</span>'

    document.getElementsByClassName("STRING_GRID_POINTS")[0].innerHTML = "Puntos de la cuadrícula"
    document.getElementsByClassName("STRING_POINT_1")[0].innerHTML = "Punto 1"
    document.getElementsByClassName("STRING_POINT_2")[0].innerHTML = "Punto 2"

    document.getElementById("point1").placeholder = "Se usan las coordenadas del punto 2"
    document.getElementById("point2").placeholder = "Se usan las coordenadas del punto 1"

    document.getElementsByClassName("STRING_GRID_LEVELS")[0].innerHTML = "Niveles de las cuadrículas"

    document.getElementsByClassName("STRING_GRID1")[0].innerHTML = "Cuadrícula 1"
    document.getElementsByClassName("STRING_GRID2")[0].innerHTML = "Cuadrícula 2"

    document.getElementsByClassName("STRING_WORKING")[0].innerHTML = "Ejecutando..."

    document.getElementsByClassName("STRING_PROBLEMS_DETECTED")[0].innerHTML = "Errores detectados"
    
    document.getElementsByClassName("STRING_DOWNLOADS")[0].innerHTML = "Descargas"
  }
}

function language_sidebar(){
  if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
    document.getElementsByClassName("STRING_MENU")[0].innerHTML = "Menú"
    document.getElementsByClassName("STRING_TOOL")[0].innerHTML = "Herramienta"
    document.getElementsByClassName("STRING_CREDITS")[0].innerHTML = "Créditos"
  }
}

function language_credits(){
  if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
    document.getElementsByClassName("STRING_CREDITS_TITLE")[0].innerHTML = "Créditos"
    document.getElementsByClassName("STRING_MORE_INFO")[0].innerHTML = "Más información"
    document.getElementsByClassName("STRING_MORE_INFO")[1].innerHTML = "Más información"

    document.getElementsByClassName("STRING_S2GEOMETRY")[0].innerHTML = "Esta librería es usada para obtener las celdas S2 y comprobar si un punto está dentro de una celda S2."
    document.getElementsByClassName("STRING_CUSTOM_FILE_INPUT")[0].innerHTML = "Este código es usado en los bloques de entrada de ficheros."
  }
}

function language_info(){
  if (navigator.language == "es-es" || navigator.language == "es" || navigator.language == "es-ES") {
    document.getElementsByClassName("STRING_IMPORTANT_TEXT")[0].innerHTML = "Pronto."
  }
}