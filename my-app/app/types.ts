// types.ts

export type ProjectWithRelations = {
  // Colonnes du projet
  id: number;
  name: string;
  slug: string;
  github_url: string;
  demo_url: string | null;
  promotion_id: number | null;
  ada_project_id: number | null;
  user_id: string | null;
  published_at: Date | null;
  created_at: Date;

  // Relations (objets JSON)
  promotion: {
    id: number;
    name: string;
  } | null;

  ada_project: {
    id: number;
    name: string;
  } | null;

  // ✅ AJOUT : Nombre de commentaires
  comments_count: number;

  // ✅ AJOUT : Tableau de commentaires
  comments: Array<{
    id: number;
    message: string;
    created_at: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
      isBanished: boolean;
    } | null;
  }>;
};

export type Promotion = {
  id: number;
  name: string;
  created_at: Date;
};
// types.ts

export type AdaProject = {
  id: number;
  name: string;
  created_at: Date;
};
// Type pour UN projet avec ses détails complets
export type ProjectDetail = {
  // Colonnes du projet
  id: number;
  name: string;
  slug: string;
  github_url: string;
  demo_url: string | null;
  promotion_id: number | null;
  ada_project_id: number | null;
  user_id: string | null;
  published_at: Date | null;
  created_at: Date;

  // Relations
  promotion: {
    id: number;
    name: string;
  } | null;

  ada_project: {
    id: number;
    name: string;
  } | null;

  // Commentaires
  comments: Array<{
    id: number;
    message: string;
    created_at: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
      isBanished: boolean;  // ← Ajouter cette ligne
    } | null;
  }>;
};

//type session
export type Session = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
}

// Type pour la session utilisateur simplifiée passée aux composants
export type UserSessionData = {
  id: string;
  name: string;
  email: string;
} | null;

export type SelectChangeEvent = React.ChangeEvent<HTMLSelectElement>;