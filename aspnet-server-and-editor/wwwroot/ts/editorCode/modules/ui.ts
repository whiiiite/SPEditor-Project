export {
    hideCaret,
    showCaret,
    addSection,
    getCaretPosInCharsGlobal,
    getCaretPosInCharsLocal,
    setCaretToPosition,
    setCaretToLine,
    getCaretClientPos,
    getCaretElement,
    getEditorContainer,
    getLineNumberContainer,
    highlightLineNumber,
    removeElement,
    addJunkSection
}

// from ts

// remove specific elemenet
function removeElement(element: HTMLElement): void {
    element.remove();
}


// add junk section for line
function addJunkSection(line: HTMLDivElement): void {
    if (line.firstChild) return;

    const innerSpan = document.createElement('span');
    innerSpan.textContent = ' ';
    innerSpan.classList.add('section');
    line.appendChild(innerSpan);
    innerSpan.textContent = '';
}


function getCaretElement(): HTMLElement {
    return document.getElementById('caret');
}

function getEditorContainer(): HTMLElement {
    return document.getElementById('editor-container');
}

function getLineNumberContainer(): HTMLElement {
    return document.getElementById('lines-numbers-container');
}

function hideCaret(): void {
    getCaretElement().style.opacity = '0';
    getCaretElement().style.animation = 'none';
}

function showCaret(): void {
    getCaretElement().style.opacity = '1';
    getCaretElement().style.animation = '0.7s fadeIn infinite';
}

// returns: real caret positions on the screen in pixels
function getCaretClientPos(): {x:number, y:number} {
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
function setCaretToLine(lineIndex: number) {
    const caret = getCaretElement();
    caret.style.top = 25 + lineIndex * 20 + 'px'
}

// set caret position to specific position ON the line
function setCaretToPosition(pos: {x: number, y: number}) {
    getCaretElement().style.left = pos.x + 'px';
    getCaretElement().style.top = pos.y + 'px';
}

// get caret position in characters around all section in line
function getCaretPosInCharsGlobal(currLine: HTMLDivElement, currSection: HTMLSpanElement) {
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

function addSection(line: HTMLDivElement, text: string, classcolor: string): HTMLSpanElement {
    const section = document.createElement('span');

    // add section
    section.textContent = text;
    section.tabIndex = -1;
    section.classList.add('section');
    section.classList.add(classcolor);
    line.appendChild(section);

    return section;
}

function highlightLineNumber(oldLineIndex:number, currentLineIndex:number): void {
    const numberCurr = getLineNumberContainer().getElementsByTagName('span')[currentLineIndex];
    const numberOld = getLineNumberContainer().getElementsByTagName('span')[oldLineIndex];

    if (numberCurr && numberOld) {
        numberOld.classList.remove("highlight");
        numberCurr.classList.add("highlight");
    }
}


// returns: positions of real caret in line
function getCaretPosInCharsLocal(): number {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    return range.endOffset;
}

function getZeroSelectionRange(): 0 | Range {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }

    return 0;
}