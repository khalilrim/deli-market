"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCommande = void 0;
const resultat_1 = require("../modele/resultat");
const parametres_1 = require("./parametres");
const regles_1 = require("./regles");
/** Service qui gère les commandes de la boutique */
class ServiceCommande {
    depot;
    stock;
    notificateur;
    parametres;
    compteur = 0;
    constructor(depot, stock, notificateur, parametres = parametres_1.PARAMETRES_PAR_DEFAUT) {
        this.depot = depot;
        this.stock = stock;
        this.notificateur = notificateur;
        this.parametres = parametres;
    }
    /** Valider une commande */
    valider(client, panier, zone, operateur, jour) {
        const lignes = panier.lignes();
        const verification = this.verifier(lignes);
        if (!verification.ok) {
            return this.refuser(verification.motif);
        }
        const sousTotal = panier.sousTotal();
        const nombre = this.nombreCommandes(client);
        const montants = (0, regles_1.calculerMontants)(sousTotal, nombre, zone, this.parametres);
        const commande = {
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
        this.notificateur.notifier("Commande " + commande.id +
            " validée pour " + client.nom);
        return (0, resultat_1.succes)(commande);
    }
    /** Modifier le statut d'une commande */
    changerStatut(id, transition) {
        const commande = this.depot.trouver(id);
        if (commande === undefined) {
            return this.refuser("commande_introuvable (" + id + ")");
        }
        const nouveau = (0, regles_1.appliquerTransition)(commande.statut, transition);
        if (!nouveau.ok) {
            return this.refuser(nouveau.motif);
        }
        if (nouveau.valeur.statut === "annulee") {
            for (const ligne of commande.lignes) {
                this.stock.remettre(ligne.produitId, ligne.quantite);
            }
        }
        const miseAJour = {
            ...commande,
            statut: nouveau.valeur
        };
        this.depot.mettreAJour(miseAJour);
        this.notificateur.notifier("Commande " + id + " : " + nouveau.valeur.statut);
        return (0, resultat_1.succes)(miseAJour);
    }
    /** Vérifier le panier et les stocks */
    verifier(lignes) {
        if (lignes.length === 0) {
            return (0, resultat_1.refus)("panier_vide");
        }
        for (const ligne of lignes) {
            const quantite = (0, regles_1.validerQuantite)(ligne.quantite, this.parametres);
            if (!quantite.ok) {
                return (0, resultat_1.refus)(quantite.motif);
            }
            if (this.stock.disponible(ligne.produitId) < ligne.quantite) {
                return (0, resultat_1.refus)("stock_insuffisant (" + ligne.nom + ")");
            }
        }
        return (0, resultat_1.succes)(null);
    }
    /** Compter les commandes du client */
    nombreCommandes(client) {
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
    prochainId() {
        this.compteur = this.compteur + 1;
        let numero = String(this.compteur);
        while (numero.length < 3) {
            numero = "0" + numero;
        }
        return "CMD-" + numero;
    }
    /** Refuser une opération */
    refuser(motif) {
        this.notificateur.notifier("Refus : " + motif);
        return (0, resultat_1.refus)(motif);
    }
}
exports.ServiceCommande = ServiceCommande;
