import type { Commande } from "../modele/types";

/** Contrat de stockage des commandes. Le métier ne connaît que cette interface. */
export interface DepotCommandes {
  ajouter(commande: Commande): void;
  tout(): readonly Commande[];
  parClient(nomClient: string): readonly Commande[];
  trouver(id: string): Commande | undefined;
  mettreAJour(commande: Commande): void;
}

/** Contrat de notification (écran, SMS, journal...). */
export interface Notificateur {
  notifier(message: string): void;
}
