export type User = {
  id: number;
  name: string | null;
  email: string | null;
  image: string | null;
};

export type DreamLike = {
  id: number;
  userId: number;
};

export type DreamComment = {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    image: string | null;
  };
};

export type Dream = {
  id: number;
  title: string;
  description: string;
  date: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  interpretation: string | null;
  imageUrl: string | null;
  imageStyle: string | null;
  user: User | null;
  likes: DreamLike[];
  comments: DreamComment[];
};

export type DreamsResponse = {
  dreams: Dream[];
  totalPages: number;
  currentPage: number;
};
