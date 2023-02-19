export default interface StockModel extends Record<string, unknown> {
  product_id: string;
  count: number;
}
