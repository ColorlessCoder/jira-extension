export default interface BaseDao<T> {
    exportData: () => Promise<T>,
    importData: (data: T) => Promise<any>
}