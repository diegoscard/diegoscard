export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  color: string;
  hoverColor: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl?: string;
  links: SocialLink[];
}
