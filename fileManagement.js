function downloadOutputFile(string, format, output_filename) {
    let file_data = "data:text/"+ format + ";charset=utf-8," + string;
    file_data = file_data.replace(/[\r]+/g, '').trim();
    var encodedUri = encodeURI(file_data);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", output_filename + "." + format);
    document.body.appendChild(link);
    link.click();
}

function downloadGrid(grid) {
    if (grid == 1) {
        downloadOutputFile(kml_string_grid1, "kml", "Level" + level_grid1 + "S2Cells");
    }
    else if (grid == 2) {
        downloadOutputFile(kml_string_grid2, "kml", "Level" + level_grid2 + "S2Cells");
    }
}

function csvJSON(csv){

    csv = "Name,lat,lng\n" + csv;
    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(let i = 1; i < lines.length; i++){

        var obj = {};
        var currentline=lines[i].split(",");
  
        for(let j = 0; j < headers.length; j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }

    return JSON.stringify(result);
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