import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('wallpapers')
export class Wallpaper {
  @PrimaryColumn()
  id: string;

  @Column()
  slug: string;

  @Column('jsonb')
  alternative_slugs: {
    en: string;
    es: string;
    ja: string;
    fr: string;
    it: string;
    ko: string;
    de: string;
    pt: string;
  };

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  promoted_at: Date;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  color: string;

  @Column()
  blur_hash: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  alt_description: string;

  @Column('jsonb', { default: [] })
  breadcrumbs: any[];

  @Column('jsonb')
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  };

  @Column('jsonb')
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };

  @Column()
  likes: number;

  @Column()
  liked_by_user: boolean;

  @Column('jsonb', { default: [] })
  current_user_collections: any[];

  @Column({ nullable: true, type: 'jsonb' })
  sponsorship: any;

  @Column('jsonb', { default: {} })
  topic_submissions: any;

  @Column()
  asset_type: string;

  @Column('jsonb')
  user: {
    id: string;
    updated_at: Date;
    username: string;
    name: string;
    first_name: string;
    last_name: string;
    twitter_username: string | null;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
      following: string;
      followers: string;
    };
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    instagram_username: string | null;
    total_collections: number;
    total_likes: number;
    total_photos: number;
    total_promoted_photos: number;
    total_illustrations: number;
    total_promoted_illustrations: number;
    accepted_tos: boolean;
    for_hire: boolean;
    social: {
      instagram_username: string | null;
      portfolio_url: string | null;
      twitter_username: string | null;
      paypal_email: string | null;
    };
  };

  @Column('jsonb')
  _metadata: {
    saved_at: Date;
    source: string;
  };
}