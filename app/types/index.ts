export type Story = {
  id: number;
  title: string;
  title_en: string;
  brief: string;
  brief_en: string;
  content: string;
  content_en: string;
  keywords: string[];
  cover_image: string;
  uder_id: number;
};

// export type Profile = {
//   id: number;
//   display_name: string;
//   bio: string;
//   avatar: string;
//   user_id: number;
// };

export type User = {
  id: number;
  email: string;
  display_name: string;
  avatar: string;
};
