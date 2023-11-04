export { applySyntaxSql }
import { stringIsNullOrWhiteSpace } from '../text.js'
import { addSection } from '../ui.js'

const classKey: string = 'class';

const plainText: string = 'plain';
const func: string = 'func';
const string: string = 'str';

function applySyntaxSql(currentLine: HTMLDivElement) {
    const text = currentLine.textContent;
    currentLine.innerHTML = '';

    let word = '';
    for (let ptr = 0; ptr < text.length; ptr++) {
        word += text[ptr];
        if (isSqlKeyword(word) && stringIsNullOrWhiteSpace(text[ptr + 1])) {
            while (stringIsNullOrWhiteSpace(text[ptr + 1]) && text[ptr + 1]) {
                word += text[ptr + 1];
                ptr++;
            }
            addSection(currentLine, word, getkeywordColorSql(word));
            word = '';
            continue;
        }
        else if (isSqlKeyword(word) && !stringIsNullOrWhiteSpace(text[ptr + 1])) {
            if (text[ptr + 1] === '(') {
                addSection(currentLine, word, getkeywordColorSql(word));
                addSection(currentLine, text[ptr + 1], getkeywordColorSql(plainText));
                word += text[ptr + 1];
                ptr++;
                word = '';
            }
        }
        else if (!isSqlKeyword(word) && ptr + 1 >= text.length) {
            addSection(currentLine, word, getkeywordColorSql(plainText));
        }
        else if (!isSqlKeyword(word) && stringIsNullOrWhiteSpace(text[ptr + 1]) || text[ptr + 1] == '*') {
            while (stringIsNullOrWhiteSpace(text[ptr + 1]) && text[ptr + 1]) {
                word += text[ptr + 1];
                ptr++;
            }
            addSection(currentLine, word, getkeywordColorSql(plainText));
            word = '';
        }
    }
}

function isSqlKeyword(keywordText: string): boolean {
    const data = getSqlSyntaxSettings();
    keywordText = keywordText.toLowerCase().trim();

    if (data.sql && data.sql[keywordText] && !isSpecialSql(keywordText)) {
        return true;
    }

    return false;
}

function getkeywordColorSql(keywordText: string): string {
    const data = getSqlSyntaxSettings();
    keywordText = keywordText.toLowerCase().trim();

    if (data.sql && data.sql[keywordText] && !isSpecialSql(keywordText)) {
        return data.sql[keywordText][classKey];
    }

    return data.sql[plainText][classKey];
}


function isSpecialSql(text: string): boolean {
    text = text.toLowerCase().trim();
    return text === func || text === plainText || text === string;
}


function getSqlSyntaxSettings() {
    return {
        sql: {
            [string]: {
                [classKey]: 'brown'
            },
            [plainText]: {
                [classKey]: 'pure'
            },
            from: {
                [classKey]: 'blue'
            },
            select: {
                [classKey]: 'blue'
            },
            where: {
                [classKey]: 'blue'
            },
            and: {
                [classKey]: 'blue'
            },
            or: {
                [classKey]: 'blue'
            },
            insert: {
                [classKey]: 'blue'
            },
            into: {
                [classKey]: 'blue'
            },
            table: {
                [classKey]: 'blue'
            },
            with: {
                [classKey]: 'blue'
            },
            as: {
                [classKey]: 'blue'
            },
            row: {
                [classKey]: 'blue'
            },
            column: {
                [classKey]: 'blue'
            },
            proc: {
                [classKey]: 'blue'
            },
            procedure: {
                [classKey]: 'blue'
            },
            function: {
                [classKey]: 'blue'
            },
            create: {
                [classKey]: 'blue'
            },
            update: {
                [classKey]: 'blue'
            },
            delete: {
                [classKey]: 'blue'
            },
            constraint: {
                [classKey]: 'blue'
            },
            add: {
                [classKey]: 'blue'
            },
            if: {
                [classKey]: 'oper'
            },
            else: {
                [classKey]: 'oper'
            },
            max: {
                [classKey]: 'oper'
            },
            min: {
                [classKey]: 'oper'
            },
        }
    };
}