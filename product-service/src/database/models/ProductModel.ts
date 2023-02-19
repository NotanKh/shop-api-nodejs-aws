export default interface ProductModel extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  price: number;
}
