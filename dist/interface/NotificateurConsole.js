"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificateurConsole = void 0;
/** affiche les messages dans le terminal */
class NotificateurConsole {
    notifier(message) {
        console.log(`   [notification] ${message}`);
    }
}
exports.NotificateurConsole = NotificateurConsole;
