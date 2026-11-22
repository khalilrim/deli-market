import { DepotCommandesMemoire } from "./donnees/DepotCommandesMemoire";
import { formaterCommande, formaterMontant } from "./interface/affichage";
import { NotificateurConsole } from "./interface/NotificateurConsole";
import { Panier } from "./metier/Panier";
import { ServiceCommande } from "./metier/ServiceCommande";
import { Stock } from "./metier/Stock";
import type { Client, Produit } from "./modele/types";

/** Les produits de la boutique */
const PAGNE: Produit = {
  id: "P1", nom: "Pagne wax 6 yards", prix: 15000, stock: 20
};

const NAPPE: Produit = {
  id: "P2", nom: "Nappe en pagne", prix: 12000, stock: 5
};

const COUSSIN: Produit = {
  id: "P3", nom: "Coussin en pagne", prix: 6500, stock: 12
};

const RAPHIA: Produit = {
  id: "P4", nom: "Panier en raphia", prix: 8000, stock: 3
};

/** On ajoute les produits au stock */
const stock = new Stock();

for (const produit of [PAGNE, NAPPE, COUSSIN, RAPHIA]) {
  stock.ajouterProduit(produit);
}

const service = new ServiceCommande(
  new DepotCommandesMemoire(),
  stock,
  new NotificateurConsole()
);

/** On affiche les titres */
function titre(texte: string): void {
  console.log(`\n=== ${texte} ===`);
}

/** On affiche le stock */
function afficherStock(): void {
  const etat = [PAGNE, NAPPE, COUSSIN, RAPHIA].map(
    (p) => `${p.nom} : ${stock.disponible(p.id)}`
  );

  console.log(`   Stock -> ${etat.join(" | ")}`);
}

/** Les clients de la boutique */
const awa: Client = { nom: "Awa", commandesPassees: 0 };
const yao: Client = { nom: "Yao", commandesPassees: 0 };
const koffi: Client = { nom: "Koffi", commandesPassees: 3 };

console.log("Deli Market : démonstration");
afficherStock();

/** Awa passe une commande */
titre("1. Awa (première commande) : panier à plusieurs produits");

const panierAwa = new Panier();
panierAwa.ajouter(PAGNE, 2);
panierAwa.ajouter(NAPPE, 1);
panierAwa.ajouter(COUSSIN, 2);

console.log(
  `   Sous-total du panier : ${formaterMontant(panierAwa.sousTotal())} (stock encore intact)`
);

afficherStock();

const commandeAwa = service.valider(
  awa, panierAwa, "peripherie", "Orange Money", "2026-11-21"
);

if (commandeAwa.ok) {
  console.log(formaterCommande(commandeAwa.valeur));
}

afficherStock();

/** Yao commande plus que le stock disponible */
titre("2. Yao : commande refusée (stock insuffisant)");

const panierYao = new Panier();
panierYao.ajouter(RAPHIA, 5);

const refusee = service.valider(
  yao, panierYao, "centre", "MTN MoMo", "2026-11-21"
);

if (!refusee.ok) {
  console.log(`   Refusée : ${refusee.motif}`);
}

afficherStock();

/** On vérifie la quantité maximale */
titre("3. Yao : quantité hors limites dans le panier");

const trop = new Panier().ajouter(PAGNE, 11);

if (!trop.ok) {
  console.log(`   Refusé : ${trop.motif}`);
}

/** Koffi a une réduction */
titre("4. Koffi (client fidèle) : remise de 8 %");

const panierKoffi = new Panier();
panierKoffi.ajouter(PAGNE, 5);

const commandeKoffi = service.valider(
  koffi, panierKoffi, "interieur", "Moov Money", "2026-11-21"
);

if (commandeKoffi.ok) {
  console.log(formaterCommande(commandeKoffi.valeur));
}

/** On expédie et livre la commande */
titre("5. Awa : expédition puis livraison");

if (commandeAwa.ok) {
  const expediee = service.changerStatut(
    commandeAwa.valeur.id,
    { vers: "expediee", transporteur: "Express Lagune" }
  );

  if (expediee.ok) {
    console.log(`   ${expediee.valeur.id} -> expédiée`);
  }

  const livree = service.changerStatut(
    commandeAwa.valeur.id,
    { vers: "livree", jour: "2026-11-23" }
  );

  if (livree.ok) {
    console.log(`   ${livree.valeur.id} -> livrée`);
  }
}

/** On annule une commande */
titre("6. Annulation permise (Koffi, en préparation) : le stock est remis");

afficherStock();

if (commandeKoffi.ok) {
  const annulee = service.changerStatut(
    commandeKoffi.valeur.id,
    { vers: "annulee", motif: "client injoignable" }
  );

  if (annulee.ok) {
    console.log(`   ${annulee.valeur.id} -> annulée`);
  }
}

afficherStock();

/** On refuse l'annulation d'une commande livrée */
titre("7. Annulation refusée (commande d'Awa déjà livrée)");

if (commandeAwa.ok) {
  const refus = service.changerStatut(
    commandeAwa.valeur.id,
    { vers: "annulee", motif: "regret" }
  );

  if (!refus.ok) {
    console.log(`   Refusée : ${refus.motif}`);
  }
}

afficherStock();