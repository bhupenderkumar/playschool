export interface IParent {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export type NewParent = Omit<IParent, 'id'> & { id: null };
