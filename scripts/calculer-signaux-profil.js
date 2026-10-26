#!/usr/bin/env node
/**
 * Exemple illustratif du principe "scripts déterministes comme seconde couche
 * de la connaissance qu'Ori a de la personne" (document de cadrage).
 *
 * Ce script ne juge jamais, ne décide jamais si un signal "compte" pour la
 * personne — il calcule des FAITS à partir des données structurées du profil.
 * Le jugement sur le sens à donner à ces faits reste entièrement celui d'Ori,
 * au moment de la conversation, jamais préempté ici.
 *
 * Entrée attendue : un objet profile au format déjà utilisé dans le POC
 * (situations: [{engine, date, ...}], traits: [{category, text, date, status}]).
 */

const JOUR_MS = 24 * 60 * 60 * 1000;

/**
 * Calcule, pour chaque moteur universel, depuis combien de jours il n'a
 * plus été touché par une situation vécue. Un fait daté, jamais une intuition.
 */
function joursDepuisDernierMoteur(situations, maintenant = new Date()) {
  const moteurs = ["securite", "connexion", "competence", "autonomie", "sens"];
  const resultat = {};
  for (const moteur of moteurs) {
    const situationsMoteur = situations.filter(s => s.engine === moteur);
    if (situationsMoteur.length === 0) {
      resultat[moteur] = null; // jamais encore touché, distinct de "touché il y a longtemps"
      continue;
    }
    const dates = situationsMoteur.map(s => new Date(s.date).getTime());
    const dernierContact = Math.max(...dates);
    resultat[moteur] = Math.floor((maintenant.getTime() - dernierContact) / JOUR_MS);
  }
  return resultat;
}

/**
 * Calcule, pour chaque trait actif du profil, son âge en jours depuis sa
 * dernière confirmation — nourrit directement la reconfirmation espacée.
 */
function agesDesTraits(traits, maintenant = new Date()) {
  return traits
    .filter(t => t.status === "actif")
    .map(t => ({
      categorie: t.category,
      texte: t.text,
      joursDepuisConfirmation: Math.floor((maintenant.getTime() - new Date(t.date).getTime()) / JOUR_MS),
    }));
}

/**
 * Calcule le rythme réel d'engagement : nombre de situations vécues par
 * semaine, sur les quatre dernières semaines glissantes, semaine par semaine.
 * Un ralentissement se lit dans la suite de chiffres, jamais dans une seule
 * conversation isolée.
 */
function rythmeEngagement(situations, maintenant = new Date()) {
  const semaines = [0, 0, 0, 0];
  for (const s of situations) {
    const joursEcoules = Math.floor((maintenant.getTime() - new Date(s.date).getTime()) / JOUR_MS);
    const indexSemaine = Math.floor(joursEcoules / 7);
    if (indexSemaine >= 0 && indexSemaine < 4) {
      semaines[indexSemaine]++;
    }
  }
  return semaines; // [cette semaine, il y a 1 semaine, il y a 2 semaines, il y a 3 semaines]
}

/**
 * Assemble les trois calculs en un seul objet de signaux, prêt à être
 * injecté dans le contexte d'Ori — jamais reformaté en phrase toute faite,
 * jamais présenté comme une conclusion, seulement comme des faits bruts
 * qu'Ori interprétera avec son propre jugement au moment de la conversation.
 */
function calculerSignauxProfil(profile, maintenant = new Date()) {
  const situations = profile.situations || [];
  const traits = profile.traits || [];
  return {
    joursDepuisDernierMoteur: joursDepuisDernierMoteur(situations, maintenant),
    agesDesTraits: agesDesTraits(traits, maintenant),
    rythmeEngagement4Semaines: rythmeEngagement(situations, maintenant),
  };
}

module.exports = { calculerSignauxProfil, joursDepuisDernierMoteur, agesDesTraits, rythmeEngagement };

// Exemple d'exécution directe, si lancé en ligne de commande avec un profil JSON
if (require.main === module) {
  const fs = require('fs');
  const cheminProfil = process.argv[2];
  if (!cheminProfil) {
    console.error("Usage : node calculer-signaux-profil.js chemin/vers/profil.json");
    process.exit(1);
  }
  const profile = JSON.parse(fs.readFileSync(cheminProfil, 'utf-8'));
  const signaux = calculerSignauxProfil(profile);
  console.log(JSON.stringify(signaux, null, 2));
}
