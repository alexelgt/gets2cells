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