export { hideCaret, showCaret, addSection, getCaretPosInCharsGlobal, getCaretPosInCharsLocal, setCaretToPosition, setCaretToLine, getCaretClientPos, getCaretElement, getEditorContainer, getLineNumberContainer, highlightLineNumber, removeElement, addJunkSection };
// from ts
// remove specific elemenet
function removeElement(element) {
    element.remove();
}
// add junk section for line
function addJunkSection(line) {
    if (line.firstChild)
        return;
    const innerSpan = document.createElement('span');
    innerSpan.textContent = ' ';
    innerSpan.classList.add('section');
    line.appendChild(innerSpan);
    innerSpan.textContent = '';
}
function getCaretElement() {
    return document.getElementById('caret');
}
function getEditorContainer() {
    return document.getElementById('editor-container');
}
function getLineNumberContainer() {
    return document.getElementById('lines-numbers-container');
}
function hideCaret() {
    getCaretElement().style.opacity = '0';
    getCaretElement().style.animation = 'none';
}
function showCaret() {
    getCaretElement().style.opacity = '1';
    getCaretElement().style.animation = '0.7s fadeIn infinite';
}
// returns: real caret positions on the screen in pixels
function getCaretClientPos() {
    var rect = { x: 0, y: 0 };
    const range = getZeroSelectionRange();
    if (range) {
        const clientRects = range.getClientRects();
        if (clientRects.length > 0) {
            const firstClientRect = clientRects[0];
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const offsetContainerY = getEditorContainer().offsetTop;
            const offsetContainerX = getEditorContainer().offsetLeft;
            rect.x = firstClientRect.left + scrollX - offsetContainerX;
            rect.y = firstClientRect.top + scrollY - offsetContainerY;
        }
    }
    return rect;
}
// set caret to specific line
function setCaretToLine(lineIndex) {
    const caret = getCaretElement();
    caret.style.top = 25 + lineIndex * 20 + 'px';
}
// set caret position to specific position ON the line
function setCaretToPosition(pos) {
    getCaretElement().style.left = pos.x + 'px';
    getCaretElement().style.top = pos.y + 'px';
}
// get caret position in characters around all section in line
function getCaretPosInCharsGlobal(currLine, currSection) {
    const allSections = currLine.getElementsByTagName('span');
    let strCounts = 0;
    const localPos = getCaretPosInCharsLocal();
    for (const current of allSections) {
        if (current === currSection) {
            return strCounts + localPos;
        }
        strCounts += current.textContent.length;
    }
    return 0;
}
function addSection(line, text, classcolor) {
    const section = document.createElement('span');
    // add section
    section.textContent = text;
    section.tabIndex = -1;
    section.classList.add('section');
    section.classList.add(classcolor);
    line.appendChild(section);
    return section;
}
function highlightLineNumber(oldLineIndex, currentLineIndex) {
    const numberCurr = getLineNumberContainer().getElementsByTagName('span')[currentLineIndex];
    const numberOld = getLineNumberContainer().getElementsByTagName('span')[oldLineIndex];
    if (numberCurr && numberOld) {
        numberOld.classList.remove("highlight");
        numberCurr.classList.add("highlight");
    }
}
// returns: positions of real caret in line
function getCaretPosInCharsLocal() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    return range.endOffset;
}
function getZeroSelectionRange() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
    return 0;
}
//# sourceMappingURL=ui.js.map