export { fourSpaces, insertIntoString, deleteCharAt, stringIsNullOrWhiteSpace, stringIsNullOrEmpty };
function insertIntoString(originalString, insert, position) {
    if (position < 0 || position > originalString.length) {
        console.error('Недопустимая позиция');
        return originalString;
    }
    const firstPart = originalString.slice(0, position);
    const secondPart = originalString.slice(position);
    const resultString = firstPart + insert + secondPart;
    return resultString;
}
// deletes char from string by specific index
function deleteCharAt(str, index) {
    if (index < 0 || index >= str.length) {
        return str;
    }
    return str.slice(0, index) + str.slice(index + 1);
}
// checks if string is null empty or white space
function stringIsNullOrWhiteSpace(text) {
    if (!text)
        return true;
    return text === null || text.trim() === '' || text.trim() === '\0';
}
// checks if string is null or empty (doesnt make check if is only white space)
function stringIsNullOrEmpty(text) {
    if (!text)
        return true;
    return text === null || text === '';
}
function fourSpaces() {
    return '    ';
}
//# sourceMappingURL=text.js.map