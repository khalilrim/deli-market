import type { Notificateur } from "../metier/contrats";

/** affiche les messages dans le terminal */
export class NotificateurConsole implements Notificateur {
  notifier(message: string): void {
    console.log(`   [notification] ${message}`);
  }
}
