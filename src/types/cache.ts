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
 *
 * <b>Note</b>
 * All <b>write</b> operations performed within this class are <b>pure</b>,
 * meaning they always return a new {@link MultipleUsersCache} instance.
 * This makes them safe to use even with libraries such as Recoil that freeze objects.
 */
export class Cache<T extends CacheableObject, C extends Partial<T>> {
  private readonly values: T[];

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
  public add(data: C): Cache<T, C> {
    const updatedValues = [...this.values];

    // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
    // @ts-ignore
    updatedValues.push({
      ...data,
      status: DataStatus.CREATED_LOCALLY,
      lastEdited: new Date(Date.now()),
    } as T);

    return new Cache<T, C>(updatedValues, this.areEquals);
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
   * Returns the cached data that match the given one, or <code>undefined</code>
   * if not found.
   * @param data - Data to be searched for.
   */
  public get(data: C): T | undefined {
    // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
    // @ts-ignore
    return this.values.find(value => this.areEquals(value as C, data));
  }

  /**
   * Returns all the cached values.
   */
  public readAll(): T[] {
    return this.values;
  }

  /**
   * Allows to filter the current cached data.
   * @param data : Filter to be applied.
   */
  public filter(data: C): T[] {
    // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
    // @ts-ignore
    return this.values.filter(value => this.areEquals(value as C, data));
  }

  /**
   * Allows to update the status of all the values that match the given search.
   * @param data - Value which status should be updated. If not found, nothing will happen.
   * @param status {DataStatus} - Status that should be set to all the values that match the given search
   */
  public updateStatus(data: C, status: DataStatus): Cache<T, C> {
    const updateValues = [...this.values].map(value => {
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

    return new Cache<T, C>(updateValues, this.areEquals);
  }

  /**
   * Removes the given data from the cache.
   * @param data - Data to be deleted from the cache.
   */
  public remove(data: C): Cache<T, C> {
    // It's fine to ignore the following warning, as C is always a Partial<T> by how we use it
    // @ts-ignore
    const updatedValues = this.values.filter(value => !this.areEquals(value as C, data));
    return new Cache<T, C>(updatedValues, this.areEquals);
  }
}

/**
 * Type that represents a cache for multiple users and a specific type of object.
 * Underlying, it uses a {@link Record} or {@link Cache} objects.
 *
 * <b>Note</b>
 * All <b>write</b> operations performed within this class are <b>pure</b>,
 * meaning they always return a new {@link MultipleUsersCache} instance.
 * This makes them safe to use even with libraries such as Recoil that freeze objects.
 */
export class MultipleUsersCache<T extends CacheableObject, C extends Partial<T>> {
  private readonly caches: Record<string, Cache<T, C>>;

  private readonly comparator: Comparator<C>;

  constructor(caches: Record<string, Cache<T, C>>, comparator: Comparator<C>) {
    this.caches = caches;
    this.comparator = comparator;
  }

  /**
   * Builds a new {@link MultipleUsersCache} using the given values and comparator.
   */
  static fromSerializedValues<T extends CacheableObject, C extends Partial<T>>(
    values: Record<string, T[]>,
    comparator: Comparator<C>,
  ): MultipleUsersCache<T, C> {
    return Object.entries(values).reduce((previous, [key, cachedValues]) => {
      return previous.add(key, cachedValues);
    }, new MultipleUsersCache<T, C>({}, comparator));
  }

  /**
   * Adds a new entry inside the caches.
   * @param user {string} - Address of the user for which to crete the cache.
   * @param initialValues - Initial values to be cached
   */
  public add(user: string, initialValues: T[] = []): MultipleUsersCache<T, C> {
    return this.update(user, new Cache<T, C>(initialValues, this.comparator));
  }

  /**
   * Updates the cache for the given user, replacing any existing value.
   * @param user {string} - Address of the user for which to update the cache.
   * @param cache {Cache} - New cache instance to be used.
   */
  public update(user: string, cache: Cache<T, C>): MultipleUsersCache<T, C> {
    const updatedValues = { ...this.caches };
    updatedValues[user] = cache;
    return new MultipleUsersCache<T, C>(updatedValues, this.comparator);
  }

  /**
   * Returns the cache for the given user.
   * @param user {string} - Address of the user for which to get the cache.
   */
  public get(user: string): Cache<T, C> {
    return this.caches[user] ?? new Cache<T, C>([], this.comparator);
  }

  /**
   * Serializes the values contained inside this instance.
   */
  public serialize(): Record<string, T[]> {
    return Object.entries(this.caches).reduce((previous, [key, value]) => {
      const reduced: Record<string, T[]> = { ...previous };
      reduced[key] = value.readAll();
      return reduced;
    }, {});
  }
}
