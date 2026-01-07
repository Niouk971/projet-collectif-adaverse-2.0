// ---------------------------------------------------------
// Extension des types internes de Better Auth pour ajouter
// les champs personnalisés présents dans ta table `user`.
//
// Better Auth génère automatiquement un type "User" basé
// sur les champs obligatoires (id, email, name, etc.).
// Cependant, il ne connaît pas tes champs additionnels
// comme `isAdmin` ou `isBanished` définis dans ton schéma Drizzle.
//
// Ce fichier, placé dans un dossier global (ex: /types/),
// permet à TypeScript de fusionner correctement ces champs
// avec les types Better Auth, afin que des propriétés comme :
//
//   session.user.isAdmin
//   session.user.isBanished
//
// soient reconnues sans erreur.
// ---------------------------------------------------------

import "better-auth";

declare module "better-auth" {
  interface User {
    isAdmin: boolean;
    isBanished: boolean;
  }
}