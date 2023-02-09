/**
 * Represents the different status that the data can have within the application.
 */
export enum DataStatus {
  /**
   * The data is synced with the chain.
   */
  SYNCED = 'SYNCED',
  /**
   * The data has been created only locally, but has yet to be synced with the chain.
   */
  CREATED_LOCALLY = 'CREATED_LOCALLY',
  /**
   * The data has been deleted only locally, but has yet to be synced with the chain.
   */
  DELETED_LOCALLY = 'DELETED_LOCALLY',
}

export interface CacheableObject {
  /**
   * Identifies the status of the data.
   */
  readonly status: DataStatus;

  /**
   * Date in which the data was lastly edited.
   * This is used in order to merge data from the server and stored locally,
   * to avoid having the local storage going too much off-sync with the server.
   */
  readonly lastEdited: Date;
}

export type Comparator<T> = (first: T, second: T) => boolean;

/**
 *
 * Type that represents a cache for a specific type of object.
 */
class Cache<T extends CacheableObject, C extends Partial<T>> {
  private values: T[];

  private readonly areEquals: Comparator<C>;

  /**
   * Builds a new Cache of a given type.
   * @param initialValues - Initial values to be stored inside the cache.
   * @param areEquals - Function that allows to determine whether two types are equals.
   */
  constructor(initialValues: T[], areEquals: Comparator<C>) {
    this.values = initialValues;
    this.areEquals = areEquals;
  }

  /**
   * Adds the given data to the cache. If the data already exists within the cache,
   * as per {@link areEquals}, then the existing value is replaced with the given one.
   * @param data - Data to be inserted.
   */
  public add(data: C) {
    this.remove(data);
    // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
    // @ts-ignore
    this.values.push({
      ...data,
      status: DataStatus.CREATED_LOCALLY,
      lastEdited: new Date(Date.now()),
    } as T);
  }

  /**
   * Checks whether the given data exists inside the cache or not.
   * The check is made using {@link areEquals} as comparison method.
   *
   * <b>Note</b>
   * The cached elements that have status {@link DataStatus.DELETED_LOCALLY}
   * are considered as <b>deleted</b> and thus will be not included in the
   * existence check.
   *
   * @param data - Data to be checked for existence.
   */
  public has(data: C) {
    return this.values.some(
      // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
      // @ts-ignore
      value => this.areEquals(value as C, data) && value.status !== DataStatus.DELETED_LOCALLY,
    );
  }

  /**
   * Returns all the cached values.
   */
  public readAll(): T[] {
    return this.values;
  }

  /**
   * Allows to update the status of all the values that match the given search.
   * @param data - Value which status should be updated. If not found, nothing will happen.
   * @param status {DataStatus} - Status that should be set to all the values that match the given search
   */
  public updateStatus(data: C, status: DataStatus) {
    this.values = this.values.map(value => {
      // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
      // @ts-ignore
      return this.areEquals(value as C, data)
        ? {
            ...value,
            status,
            lastEdited: new Date(Date.now()),
          }
        : value;
    });
  }

  /**
   * Removes the given data from the cache.
   * @param data - Data to be deleted from the cache.
   */
  public remove(data: C) {
    // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
    // @ts-ignore
    this.values = this.values.filter(value => !this.areEquals(value as C, data));
  }
}

export default Cache;
