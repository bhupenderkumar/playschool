export interface IHome {
  id: number;
  description?: string | null;
  sliders?: string | null;
  slidersContentType?: string | null;
}

export type NewHome = Omit<IHome, 'id'> & { id: null };
