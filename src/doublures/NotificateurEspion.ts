import type { Notificateur } from "../metier/contrats";

/** On garde les messages pour les vérifier pendant les tests */
export class NotificateurEspion implements Notificateur {
  readonly messages: string[] = [];

  /** On ajoute chaque message dans le tableau */
  notifier(message: string): void {
    this.messages.push(message);
  }
}
