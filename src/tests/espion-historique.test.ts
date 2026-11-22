import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decrireStatut, formaterMontant } from "../interface/affichage";
import { Panier } from "../metier/Panier";
import { DEBUTANT, NOUVEAU, PAGNE, SAVON, creerBanc, panierDe } from "./aide";

/** On vérifie les messages du programme */
describe("Notificateur espion", () => {
  it("une commande validée envoie une notification", () => {
    const { service, notificateur } = creerBanc();
    service.valider(DEBUTANT, panierDe(PAGNE, 1), "centre", "Orange Money", "2026-11-21");
    assert.equal(notificateur.messages.length, 1);
    assert.match(notificateur.messages[0] ?? "", /CMD-001 validée/);
  });

  it("un refus est notifié avec son motif", () => {
    const { service, notificateur } = creerBanc();
    service.valider(DEBUTANT, new Panier(), "centre", "Orange Money", "2026-11-21");
    assert.deepEqual(notificateur.messages, ["Refus : panier_vide"]);
  });
});

/** On vérifie les réductions des clients */
describe("Historique du client (R3, R9)", () => {
  it("la bienvenue ne s'applique qu'à la première commande", () => {
    const { service } = creerBanc();
    const premiere = service.valider(NOUVEAU, panierDe(PAGNE, 1), "centre", "Orange Money", "2026-11-21");
    const seconde = service.valider(NOUVEAU, panierDe(PAGNE, 1), "centre", "Orange Money", "2026-11-22");

    assert.ok(premiere.ok && seconde.ok);
    assert.equal(premiere.valeur.total, 15000 - 1000 + 1000);
    assert.equal(seconde.valeur.total, 15000 + 1000);
  });

  it("les commandes enregistrées comptent pour la remise fidélité", () => {
    const { service } = creerBanc();
    service.valider(DEBUTANT, panierDe(SAVON, 1), "centre", "Orange Money", "2026-11-21"); // 1 + 1 = 2
    const r = service.valider(DEBUTANT, panierDe(PAGNE, 2), "centre", "Orange Money", "2026-11-22");

    assert.ok(r.ok);
    /** On vérifie le total après la remise et la livraison*/
    assert.equal(r.valeur.total, 28600);
  });

  it("une commande annulée ne compte pas", () => {
    const { service } = creerBanc();
    const c = service.valider(NOUVEAU, panierDe(SAVON, 1), "centre", "Orange Money", "2026-11-21");

    assert.ok(c.ok);
    service.changerStatut(c.valeur.id, { vers: "annulee", motif: "test" });

    const r = service.valider(NOUVEAU, panierDe(PAGNE, 1), "centre", "Orange Money", "2026-11-22");

    assert.ok(r.ok);
    assert.equal(r.valeur.total, 15000 - 1000 + 1000);
  });
});

/** On vérifie comment les montants et les statuts s'affichent */
describe("Affichage", () => {
  it("formaterMontant sépare les milliers", () => {
    assert.equal(formaterMontant(500), "500 FCFA");
    assert.equal(formaterMontant(47470), "47 470 FCFA");
    assert.equal(formaterMontant(1000000), "1 000 000 FCFA");
  });

  it("decrireStatut traite les quatre variantes", () => {
    assert.equal(decrireStatut({ statut: "en_preparation" }), "en préparation");
    assert.equal(decrireStatut({ statut: "expediee", transporteur: "T1" }), "expédiée par T1");
    assert.equal(decrireStatut({ statut: "livree", jour: "2026-11-22" }), "livrée le 2026-11-22");
    assert.equal(decrireStatut({ statut: "annulee", motif: "client" }), "annulée (client)");
  });
});