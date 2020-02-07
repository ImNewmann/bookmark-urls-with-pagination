export default class Validation {
    static urlExists (url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;  
        }
    }
}