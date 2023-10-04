/* eslint-disable no-unused-vars */

export interface Repository<X extends { id: string | number }> {
  getAll(): Promise<X[]>;
  getById(id: X['id']): Promise<X>;
  search?({ key, value }: { key: string; value: unknown }): Promise<X[]>;
  create(newData: Partial<X>): Promise<X>;
  update(id: X['id'], newData: Partial<X>): Promise<X>;
  delete(id: X['id']): Promise<void>;
}
