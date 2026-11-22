import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Panier } from "../metier/Panier";
import type { Produit } from "../modele/types";
import { DEBUTANT, FIDELE, NAPPE, NOUVEAU, PAGNE, creerBanc, panierDe } from "./aide";

/** On crée un produit pour tester les prix */
const produitA = (prix: number): Produit => ({
  id: "PX",
  nom: "Produit test",
  prix,
  stock: 10
});

/** On vérifie les montants des commandes */
describe("ServiceCommande : montants (R1, R3, R4, R5, R9)", () => {
  it("45 000 en périphérie, client avec 1 commande : livraison 1 500, total 46 500, frais 465", () => {
    const { service } = creerBanc();
    const r = service.valider(DEBUTANT, panierDe(produitA(45000), 1), "peripherie", "Orange Money", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(r.valeur.livraison.frais, 1500);
    assert.equal(r.valeur.total, 46500);
    assert.equal(r.valeur.fraisPaiement, 465);
    assert.equal(r.valeur.aPayer, 46965);
  });

  it("R9 : client sans commande, 45 000 : bienvenue 1 000, total 45 500, frais 455", () => {
    const { service } = creerBanc();
    const r = service.valider(NOUVEAU, panierDe(produitA(45000), 1), "peripherie", "MTN MoMo", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(r.valeur.total, 45500);
    assert.equal(r.valeur.aPayer, 45955);
  });

  /** On vérifie quand la livraison est gratuite */
  it("livraison gratuite à 60 000 pile (seuil inclus)", () => {
    const { service } = creerBanc();
    const r = service.valider(DEBUTANT, panierDe(produitA(60000), 1), "peripherie", "Moov Money", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(r.valeur.livraison.frais, 0);
    assert.equal(r.valeur.total, 60000);
    assert.equal(r.valeur.fraisPaiement, 600);
  });

  it("livraison facturée à 59 999", () => {
    const { service } = creerBanc();
    const r = service.valider(DEBUTANT, panierDe(produitA(59999), 1), "peripherie", "Orange Money", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(r.valeur.livraison.frais, 1500);
    assert.equal(r.valeur.total, 61499);
    assert.equal(r.valeur.fraisPaiement, 615);
  });

  /** On vérifie la réduction fidélité */
  it("R3 : client fidèle, 64 000 : remise 5 120 -> 58 880, donc livraison facturée", () => {
    const { service } = creerBanc();
    const r = service.valider(FIDELE, panierDe(produitA(64000), 1), "peripherie", "Orange Money", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(r.valeur.livraison.frais, 1500);
    assert.equal(r.valeur.total, 60380);
    assert.equal(r.valeur.fraisPaiement, 604);
  });

  it("R3 : client fidèle, 70 000 : remise 5 600 -> 64 400, livraison gratuite", () => {
    const { service } = creerBanc();
    const r = service.valider(FIDELE, panierDe(produitA(70000), 1), "peripherie", "Orange Money", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(r.valeur.total, 64400);
    assert.equal(r.valeur.livraison.frais, 0);
  });

  /** On vérifie les frais de paiement */
  it("R5 : frais de paiement minimum 100 pour un petit total", () => {
    const { service } = creerBanc();
    const r = service.valider(DEBUTANT, panierDe(produitA(5000), 1), "centre", "Orange Money", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(r.valeur.total, 6000);
    assert.equal(r.valeur.fraisPaiement, 100);
    assert.equal(r.valeur.aPayer, 6100);
  });

  it("R4 : livraison à l'intérieur du pays facturée 5 000", () => {
    const { service } = creerBanc();
    const r = service.valider(DEBUTANT, panierDe(produitA(10000), 1), "interieur", "Orange Money", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(r.valeur.livraison.frais, 5000);
  });
});

/** On vérifie les commandes et le stock */
describe("ServiceCommande : validation et stock (R2)", () => {
  it("la validation diminue le stock et enregistre la commande", () => {
    const { service, stock, depot } = creerBanc();
    const r = service.valider(DEBUTANT, panierDe(PAGNE, 3), "centre", "Orange Money", "2026-11-21");

    assert.ok(r.ok);
    assert.equal(stock.disponible(PAGNE.id), 17);
    assert.equal(depot.tout().length, 1);
  });

  it("l'ajout au panier ne touche pas au stock", () => {
    const { stock } = creerBanc();
    const panier = new Panier();
    panier.ajouter(PAGNE, 3);

    assert.equal(stock.disponible(PAGNE.id), 20);
  });

  /** On refuse si le stock est insuffisant */
  it("quantité supérieure au stock : refus, stock et dépôt intacts", () => {
    const { service, stock, depot } = creerBanc();
    const r = service.valider(DEBUTANT, panierDe(NAPPE, 6), "centre", "Orange Money", "2026-11-21");

    assert.ok(!r.ok);
    assert.equal(r.motif, "stock_insuffisant (Nappe en pagne)");
    assert.equal(stock.disponible(NAPPE.id), 5);
    assert.equal(depot.tout().length, 0);
  });

  it("panier vide : refusé", () => {
    const { service } = creerBanc();
    const r = service.valider(DEBUTANT, new Panier(), "centre", "Orange Money", "2026-11-21");

    assert.ok(!r.ok);
    assert.equal(r.motif, "panier_vide");
  });
});

/** On vérifie les statuts des commandes */
describe("ServiceCommande : statuts (R6)", () => {
  it("en préparation -> expédiée -> livrée", () => {
    const { service } = creerBanc();
    const c = service.valider(DEBUTANT, panierDe(PAGNE, 1), "centre", "Orange Money", "2026-11-21");

    assert.ok(c.ok);

    const e = service.changerStatut(c.valeur.id, {
      vers: "expediee",
      transporteur: "Express Abidjan"
    });
    assert.ok(e.ok);

    const l = service.changerStatut(c.valeur.id, {
      vers: "livree",
      jour: "2026-11-23"
    });
    assert.ok(l.ok);
    assert.deepEqual(l.valeur.statut, {
      statut: "livree",
      jour: "2026-11-23"
    });
  });

  /** On vérifie qu'une annulation remet le stock */
  it("annulation depuis en préparation : acceptée, stock remis", () => {
    const { service, stock } = creerBanc();
    const c = service.valider(DEBUTANT, panierDe(PAGNE, 4), "centre", "Orange Money", "2026-11-21");

    assert.ok(c.ok);
    assert.equal(stock.disponible(PAGNE.id), 16);

    const a = service.changerStatut(c.valeur.id, {
      vers: "annulee",
      motif: "client absent"
    });

    assert.ok(a.ok);
    assert.equal(stock.disponible(PAGNE.id), 20);
  });

  /** On refuse l'annulation après la livraison */
  it("annulation depuis livrée : refusée, statut et stock inchangés", () => {
    const { service, stock, depot } = creerBanc();
    const c = service.valider(DEBUTANT, panierDe(PAGNE, 2), "centre", "Orange Money", "2026-11-21");

    assert.ok(c.ok);

    service.changerStatut(c.valeur.id, {
      vers: "expediee",
      transporteur: "T1"
    });

    service.changerStatut(c.valeur.id, {
      vers: "livree",
      jour: "2026-11-22"
    });

    const a = service.changerStatut(c.valeur.id, {
      vers: "annulee",
      motif: "test"
    });

    assert.ok(!a.ok);
    assert.equal(stock.disponible(PAGNE.id), 18);
    assert.equal(depot.trouver(c.valeur.id)?.statut.statut, "livree");
  });

  it("livrer sans expédier est refusé ; commande inconnue est refusée", () => {
    const { service } = creerBanc();
    const c = service.valider(DEBUTANT, panierDe(PAGNE, 1), "centre", "Orange Money", "2026-11-21");

    assert.ok(c.ok);
    assert.ok(!service.changerStatut(c.valeur.id, {
      vers: "livree",
      jour: "2026-11-22"
    }).ok);

    assert.ok(!service.changerStatut("CMD-999", {
      vers: "annulee",
      motif: "test"
    }).ok);
  });
});