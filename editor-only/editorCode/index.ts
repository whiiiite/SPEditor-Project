import {
    fourSpaces, insertIntoString,
    deleteCharAt,
    stringIsNullOrWhiteSpace
} from './modules/text.js';

import {
    getCaretPosInCharsLocal,
    setCaretToLine,
    setCaretToPosition,
    getCaretElement,
    getCaretClientPos,
    getEditorContainer,
    getLineNumberContainer,
    getCaretPosInCharsGlobal,
    showCaret,
    hideCaret,
    highlightLineNumber,
    removeElement,
    addJunkSection
} from './modules/ui.js';

import { analizeAndApplySyntax } from './modules/syntaxAnalizer.js'

let currIndex: number = 0;
let currLine: HTMLDivElement;
let currSection: HTMLSpanElement;
let selectedLang: string = 'sql';

let eventContainer: Function;

const lineClass: string = '.line';
const lineFocusedClass: string = 'line-focused';
const sectionClass: string = 'section';
const lineClassName: string = 'line';
const lineNumberClass: string = 'line-number';

// keyboard events for whole document
function setKeyboardEvents(): void {
    document.addEventListener('keydown', (event) => {
        let currentPos = getCaretPosInCharsLocal();

        if (event.keyCode === 13) {
            event.preventDefault();
            enter(currLine, currSection, currentPos);
        }
        else if (event.keyCode === 38) {
            event.preventDefault();
            arrowUp(currIndex);
        }
        else if (event.keyCode === 40) {
            event.preventDefault();
            arrowDown(currIndex);
            setCursorTo(currSection, currSection.textContent.length);
        }
        else if (event.keyCode === 9) {
            if (!currLine) return;

            event.preventDefault();
            currSection.textContent = insertIntoString(currSection.textContent, fourSpaces(), currentPos);
            setCursorTo(currSection, currentPos + 4);
            currentPos++;
        }
        else if (event.keyCode === 222) {
            event.preventDefault();
            if (event.shiftKey) {
                currSection.textContent = insertIntoString(currSection.textContent, '"', currentPos);
            }
            else {
                currSection.textContent = insertIntoString(currSection.textContent, "'", currentPos);
            }
            setCursorTo(currSection, currentPos + 1);
            return;
        }
        else if (event.keyCode === 8) {
            event.preventDefault();
            backSpace(currLine, currIndex, currSection, currentPos);
        }
        else if (event.keyCode === 37) {
            event.preventDefault();
            arrowLeft();
        }
        else if (event.keyCode === 39) {
            event.preventDefault();
            arrowRight();
        }
        else if (event.ctrlKey && event.keyCode === 83) {
            event.preventDefault();
            return;
        }

        if (event.key.length !== 1) return;

        currSection.textContent = insertIntoString(currSection.textContent, event.key, currentPos);

        setCursorTo(currSection, currentPos + 1);
        let globalPos = getCaretPosInCharsGlobal(currLine, currSection);

        // todo: do something with this junk code
        applySyntaxLine(currLine);
        currSection = findCurrentSection(globalPos);
        currSection.focus();
        setCursorTo(currSection, currentPos + 1);
        setCaretToPosition(getCaretClientPos());
        addJunkSection(currLine);

        console.log(currSection);
        console.log('global after all: ' + globalPos);
        console.log('local: ' + currentPos);
    });
}


function applySyntaxLine(line: HTMLDivElement): void {
    analizeAndApplySyntax(selectedLang, line);
}


function findCurrentSection(globalPos: number): HTMLSpanElement {
    const sections = currLine.getElementsByClassName(sectionClass);
    let currentPos = 0;

    for (const section of sections) {
        const sectionText = section.textContent;
        const sectionLength = sectionText.length;

        if (currentPos + sectionLength + 1 > globalPos) {
            return section as HTMLSpanElement;
        }

        currentPos += sectionLength;
    }

    return currSection;
}


function setFocusEventElement(element: HTMLDivElement, index: number): Function {
    const focusHandler = (event) => {
        addJunkSection(element);
        highlightLineNumber(currIndex, index);

        currLine.classList.remove(lineFocusedClass);
        currIndex = index;
        currLine = element;
        currLine.classList.add(lineFocusedClass);
        currSection = currLine.lastChild as HTMLSpanElement;
        setCaretToPosition(getCaretClientPos());
    };

    const clickHandler = (event) => {
        setCaretToPosition(getCaretClientPos());
    };

    const focusInHandler = (event) => {
        if (event.target.tagName === 'SPAN') {
            addJunkSection(element);
            highlightLineNumber(currIndex, index);

            currLine.classList.remove(lineFocusedClass);
            currSection = event.target;
            currIndex = index;
            currLine = element;
            currLine.classList.add(lineFocusedClass);
        }
    }

    element.addEventListener('focus', focusHandler);
    element.addEventListener('focusin', focusInHandler);
    element.addEventListener('click', clickHandler);

    return () => {
        element.removeEventListener('focus', focusHandler);
        element.removeEventListener('focusin', focusInHandler);
        element.removeEventListener('click', clickHandler);
    }; // save link to the function for clean the event
}


function setFocusEvent(): void {
    const lines = document.querySelectorAll<HTMLDivElement>(lineClass);

    // cleaning all events
    lines.forEach(() => {
        if (eventContainer)
            eventContainer();
    });

    // set events and keep their events
    lines.forEach((element, index) => {
        eventContainer = setFocusEventElement(element, index);
    });
}


/*
* Add line to view. 
* Prepend line if cursor position is 0. 
* But append line if cursor position is greater than 0 or line is empty
*
*
* @param currLine: HTMLDivElement
*/
function addLine(currLine: HTMLDivElement, currentCharPos: number) {
    const line: HTMLDivElement = document.createElement('div');
    const innerSpan: HTMLSpanElement = document.createElement('span');
    innerSpan.textContent = '';
    innerSpan.classList.add(sectionClass);
    line.spellcheck = false;
    line.tabIndex = 1;
    line.classList.add(lineClassName);
    line.appendChild(innerSpan);
    const editorContainer = getEditorContainer();

    let isBefore:boolean = false;

    if (currentCharPos === 0 && currLine.textContent.length !== 0 && !currSection.previousSibling) {
        editorContainer.insertBefore(line, currLine);
        isBefore = true;
    }
    else {
        editorContainer.insertBefore(line, currLine.nextSibling);
    }

    recountLines();
    setFocusEvent();
    line.focus();

    return { line: line, isBefore: isBefore };
}


/*
* Recount and replace all lines and set UI by numbers of lines 
* 
*/
function recountLines(): void {
    const lines = document.getElementsByClassName(lineClassName);
    const linesNumbersContainer = getLineNumberContainer();
    linesNumbersContainer.innerHTML = '';

    let number;
    let lineTop;

    const startTopOffset = 15;
    const onMultiple = 20;

    for (let index = 0; index < lines.length; index++) {
        lineTop = onMultiple * (index) + startTopOffset;

        (lines[index] as HTMLElement).style.top = lineTop + 'px';
        (lines[index] as HTMLElement).tabIndex = index + 1;

        number = document.createElement('span');
        number.textContent = index + 1;
        number.classList.add(lineNumberClass);
        number.style = `top: ${lineTop + 2}px;`;

        linesNumbersContainer.appendChild(number);

        if (index === lines.length - 1) {
            getEditorContainer().style.height = lineTop + 30 + 'px'
        }
    }

    highlightLineNumber(currIndex, currIndex);
}

function tab() {

}

function enter(currentLine: HTMLDivElement, currentSection: HTMLSpanElement, currPos: number): void {
    // from ts
    const str = currentLine.textContent;

    let leftPart = "";
    let rightPart = "";

    const globalPos = getCaretPosInCharsGlobal(currentLine, currentSection);
    const addedLineData = addLine(currentLine, currPos);
    const addedLine = addedLineData.line;

    if (globalPos <= str.length) {
        rightPart = str.slice(globalPos, str.length);
        leftPart = str.slice(0, globalPos);

        if (!stringIsNullOrWhiteSpace(leftPart)) {
            currentLine.textContent = leftPart;
            applySyntaxLine(currentLine);
        } else {
            currentLine.textContent = '';
            rightPart = leftPart + rightPart;
        }
    }
    if (!stringIsNullOrWhiteSpace(rightPart)) {
        if (leftPart === '') {
            currentLine.textContent = rightPart;
        }
        else {
            addedLine.textContent = rightPart;
        }

        applySyntaxLine(currentLine);
        applySyntaxLine(addedLine);

        if (addedLineData.isBefore) {
            currentSection = currentLine.firstChild as HTMLSpanElement;
        }
        else {
            currentSection = addedLine.firstChild as HTMLSpanElement;
        }

        currentSection.focus();
        setCursorTo(currentSection, 0);
        setCaretToPosition(getCaretClientPos());
    }
}

// Function for moving the cursor up to the previous line
function arrowUp(index: number): void {
    if (index === 0) return;

    // Get the previous line element
    const line = document.getElementsByClassName(lineClassName)[index - 1];
    (line as HTMLElement).focus();
    setCursorTo(currSection, currSection.textContent.length);
}

// Function for moving the cursor down to the next line
function arrowDown(index: number): void {
    const lines = document.getElementsByClassName(lineClassName);
    if (index >= lines.length - 1) return;

    // Get the next line element
    const line = lines[index + 1];
    (line as HTMLElement).focus();
    setCursorTo(currSection, currSection.textContent.length);
}

// Function for moving the cursor to the left on the same line
function arrowLeft(): void {
    const currentPos = getCaretPosInCharsLocal();

    if (currentPos > 0) {
        setCursorTo(currSection, currentPos - 1);
    } else if (currentPos === 0) {
        if (currSection.previousSibling)
            currSection = currSection.previousSibling as HTMLSpanElement;
        else return;
        currSection.focus();
        setCursorTo(currSection, currSection.textContent.length - 1);
    }
}

// Function for moving the cursor to the right on the same line
function arrowRight(): void {
    const currentPos = getCaretPosInCharsLocal();

    if (currentPos < currSection.textContent.length) {
        setCursorTo(currSection, currentPos + 1);
    } else {
        if (currSection.nextSibling)
            currSection = currSection.nextSibling as HTMLSpanElement;
        else return;
        currSection.focus();
        setCursorTo(currSection, 0);
    }
}

function backSpace(currLine: HTMLDivElement, currIndex: number,
    currSection: HTMLSpanElement, currentPos: number): void {
    const prevSection: HTMLSpanElement = currSection.previousSibling as HTMLSpanElement;
    const nextSection: HTMLSpanElement = currSection.nextSibling as HTMLSpanElement;

    if (!stringIsNullOrWhiteSpace(currSection.textContent)) {
        currSection.textContent = deleteCharAt(currSection.textContent, currentPos - 1);
        if (currentPos > 0) {
            setCursorTo(currSection, currentPos - 1);
        }
        else {
            if (prevSection) {
                currSection = prevSection;
                currSection.focus();
                setCursorTo(currSection, currSection.textContent.length);
            }
        }
        return;
    }

    if (prevSection) {
        const tmp = currSection;
        currSection = prevSection;
        currSection.focus();
        removeElement(tmp);
        setCursorTo(currSection, currSection.textContent.length);
    } else if (nextSection) {
        const tmp = currSection;
        currSection = nextSection;
        currSection.focus();
        removeElement(tmp);
        setCursorTo(currSection, 0);
    } else {
        removeElement(currLine);
        arrowUp(currIndex);
        setFocusEvent(); // restore right index order
    }

    recountLines();
}


// sets cursor to position in line element
function setCursorTo(element: HTMLSpanElement, positionTo: number) {
    if (!element.firstChild) return;

    if (element.firstChild.textContent.length < positionTo) {
        positionTo = element.firstChild.textContent.length - 1;
        if (element.firstChild.textContent[positionTo] !== ' ') {
            positionTo = element.firstChild.textContent.length;
        }
    }

    const selection = window.getSelection();
    const range = document.createRange();
    const startNode = element.firstChild;
    const startOffset = positionTo;
    range.setStart(startNode, startOffset);
    range.setEnd(startNode, startOffset);

    selection.removeAllRanges();
    selection.addRange(range);

    setCaretToPosition(getCaretClientPos());
}

// switching visibility of caret
function switchCaretVisibility(): void {
    const isVisible = getCaretElement().style.opacity === '1' ? true : false;
    if (isVisible) hideCaret();
    else showCaret();
}

// sets interval for change caret ipos by delay
function caretUpdater(delay: number): void {
    if (delay <= 0) throw new Error('delay must be more or equals than zero');

    setInterval(() => {
        const pos = getCaretClientPos();
        getCaretElement().style.left = pos.x + 'px';
        getCaretElement().style.top = pos.y + 'px';
    }, delay);
}

// sets interval for change caret visibility by delay
function caretVisibilitySwitcher(delay: number): void {
    if (delay <= 0) throw new Error('delay must be more or equals than zero');

    setInterval(() => {
        const pos = getCaretClientPos();
        if (pos.x !== 0) {
            switchCaretVisibility();
        }
        else {
            hideCaret();
        }
    }, delay);
}

// init editor
function __init_1(): void {
    currLine = document.getElementsByClassName(lineClassName)[0] as HTMLDivElement;
    currIndex = 0;
    currLine.focus();

    setKeyboardEvents();
    setFocusEvent();
    recountLines();

    setCaretToLine(0);
    caretUpdater(5);
    caretVisibilitySwitcher(500);
}

__init_1();