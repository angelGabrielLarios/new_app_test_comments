export function convertDate(dateString) {
    // Replace slashes ("/") with hyphens ("-")
    const dateWithHyphens = dateString.replace(/\//g, '-');
    // Replace comma (",") with underscore ("_")
    const dateWithHyphensAndUnderscore = dateWithHyphens.replace(/,/g, '_');
    return dateWithHyphensAndUnderscore;
}