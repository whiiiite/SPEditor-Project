export { analizeAndApplySyntax };
import { applySyntaxSql } from './syntax/sql_sa';
const sqlLang = 'sql';
const cLang = 'c';
const plainLang = 'plaintext';
function analizeAndApplySyntax(selectedLang, line) {
    if (selectedLang.trim().toLowerCase() === sqlLang) {
        applySyntaxSql(line);
    }
    else if (selectedLang.trim().toLowerCase() === plainLang) {
    }
    else if (selectedLang.trim().toLowerCase() === cLang) {
    }
    else {
    }
}
//# sourceMappingURL=syntaxAnalizer.js.map