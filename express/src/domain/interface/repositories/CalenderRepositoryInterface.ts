export interface ICalenderRepository {
  getItem<T>(key: Record<string, any>): Promise<T>
  putItem(item: Record<string, any>): Promise<void>
}