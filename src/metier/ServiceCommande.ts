import { refus, succes, type Resultat } from "../modele/resultat";
import type {
  Client,
  Commande,
  LigneCommande,
  Operateur,
  Transition,
  ZoneLivraison
} from "../modele/types";
import type { DepotCommandes, Notificateur } from "./contrats";
import { Panier } from "./Panier";
import { PARAMETRES_PAR_DEFAUT, type Parametres } from "./parametres";
import { appliquerTransition, calculerMontants, validerQuantite } from "./regles";
import { Stock } from "./Stock";

/** Service qui gère les commandes de la boutique */
export class ServiceCommande {
  private compteur = 0;

  constructor(
    private readonly depot: DepotCommandes,
    private readonly stock: Stock,
    private readonly notificateur: Notificateur,
    private readonly parametres: Parametres = PARAMETRES_PAR_DEFAUT
  ) {}

  /** Valider une commande */
  valider(
    client: Client,
    panier: Panier,
    zone: ZoneLivraison,
    operateur: Operateur,
    jour: string
  ): Resultat<Commande> {

    const lignes = panier.lignes();

    const verification = this.verifier(lignes);

    if (!verification.ok) {
      return this.refuser(verification.motif);
    }

    const sousTotal = panier.sousTotal();
    const nombre = this.nombreCommandes(client);

    const montants = calculerMontants(
      sousTotal,
      nombre,
      zone,
      this.parametres
    );

    const commande: Commande = {
      id: this.prochainId(),
      client: client.nom,
      lignes: lignes,
      statut: { statut: "en_preparation" },
      livraison: {
        zone: zone,
        frais: montants.fraisLivraison
      },
      operateur: operateur,
      total: montants.total,
      fraisPaiement: montants.fraisPaiement,
      aPayer: montants.aPayer,
      jour: jour
    };

    for (const ligne of lignes) {
      this.stock.retirer(ligne.produitId, ligne.quantite);
    }

    this.depot.ajouter(commande);

    this.notificateur.notifier(
      "Commande " + commande.id +
      " validée pour " + client.nom
    );

    return succes(commande);
  }

  /** Modifier le statut d'une commande */
  changerStatut(
    id: string,
    transition: Transition
  ): Resultat<Commande> {

    const commande = this.depot.trouver(id);

    if (commande === undefined) {
      return this.refuser("commande_introuvable (" + id + ")");
    }

    const nouveau = appliquerTransition(
      commande.statut,
      transition
    );

    if (!nouveau.ok) {
      return this.refuser(nouveau.motif);
    }

    if (nouveau.valeur.statut === "annulee") {
      for (const ligne of commande.lignes) {
        this.stock.remettre(
          ligne.produitId,
          ligne.quantite
        );
      }
    }

    const miseAJour: Commande = {
      ...commande,
      statut: nouveau.valeur
    };

    this.depot.mettreAJour(miseAJour);

    this.notificateur.notifier(
      "Commande " + id + " : " + nouveau.valeur.statut
    );

    return succes(miseAJour);
  }

  /** Vérifier le panier et les stocks */
  private verifier(
    lignes: readonly LigneCommande[]
  ): Resultat<null> {

    if (lignes.length === 0) {
      return refus("panier_vide");
    }

    for (const ligne of lignes) {
      const quantite = validerQuantite(
        ligne.quantite,
        this.parametres
      );

      if (!quantite.ok) {
        return refus(quantite.motif);
      }

      if (this.stock.disponible(ligne.produitId) < ligne.quantite) {
        return refus("stock_insuffisant (" + ligne.nom + ")");
      }
    }

    return succes(null);
  }

  /** Compter les commandes du client */
  private nombreCommandes(client: Client): number {
    let nombre = client.commandesPassees;

    const commandes = this.depot.parClient(client.nom);

    for (const commande of commandes) {
      if (commande.statut.statut !== "annulee") {
        nombre = nombre + 1;
      }
    }

    return nombre;
  }

  /** Créer l'id de la commande */
  private prochainId(): string {
    this.compteur = this.compteur + 1;

    let numero = String(this.compteur);

    while (numero.length < 3) {
      numero = "0" + numero;
    }

    return "CMD-" + numero;
  }

  /** Refuser une opération */
  private refuser(motif: string): Resultat<never> {
    this.notificateur.notifier("Refus : " + motif);

    return refus(motif);
  }
}