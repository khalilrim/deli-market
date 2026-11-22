"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificateurEspion = void 0;
/** On garde les messages pour les vérifier pendant les tests */
class NotificateurEspion {
    messages = [];
    /** On ajoute chaque message dans le tableau */
    notifier(message) {
        this.messages.push(message);
    }
}
exports.NotificateurEspion = NotificateurEspion;
