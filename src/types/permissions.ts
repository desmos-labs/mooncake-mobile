/**
 * Enum that represents a permission status
 */
enum AppPermissionStatus {
  /**
   * Permission granted.
   */
  Granted,
  /**
   * The permission have been denied from the user.
   */
  Denied,
  /**
   * The permission have been asked to the user several times
   * and now the os don't allow to request the permission from
   * inside the app.
   */
  Blocked,
}

export default AppPermissionStatus;
