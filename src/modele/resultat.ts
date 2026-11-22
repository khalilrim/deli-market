/** On indique si une opération a réussi ou non */
export type Resultat<T> =
  | { readonly ok: true; readonly valeur: T }
  | { readonly ok: false; readonly motif: string };

/** On renvoie un résultat quand tout se passe bien */
export function succes<T>(valeur: T): Resultat<T> {
  return { ok: true, valeur };
}

/** On renvoie un message quand une opération échoue */
export function refus(motif: string): Resultat<never> {
  return { ok: false, motif };
}