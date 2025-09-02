export interface Database {
  name: string;
  dataCount: number;
  type: 'MAIN' | 'SUB';
}

export interface DatabaseTable {
  name: string;
  id: string;
}
