enum ROUTES {
  // -------------------------------------------------------------------------------------
  // --- INITIAL SCREENS
  // -------------------------------------------------------------------------------------

  ONBOARDING = 'ONBOARDING',
  FOLLOW_CREATORS = 'FOLLOW_CREATORS',
  LANDING = 'LANDING',
  WELCOME = 'WELCOME',
  SERVICE_AND_POLICY = 'SERVICE_AND_POLICY',
  WELCOME_PAGE = 'WELCOME_PAGE',
  FEE_GRANT_WAITING_SCREEN = 'FEE_GRANT_WAITING_SCREEN',

  // Development
  DEV_SCREEN = 'DEV_SCREEN',
  DEV_COMPONENTS = 'DEV_COMPONENTS',

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

  // Import account
  IMPORT_ACCOUNT_PRIVATE_KEY = 'IMPORT_ACCOUNT_PRIVATE_KEY',

  // Account password
  PASSWORD_MANIPULATION = 'PASSWORD_MANIPULATION',

  // -------------------------------------------------------------------------------------
  // --- HOME SCREENS
  // -------------------------------------------------------------------------------------

  // Bottom tabs
  BOTTOM_TABS = 'BOTTOM_TABS',
  CREATE_BUTTON = 'CREATE_BUTTON',
  ACTIVITIES = 'ACTIVITIES',
  SEARCH_TABS = 'SEARCH_TABS',

  // Home pages
  HOME_TABS = 'HOME_TABS',
  HOME_TAB_DISCOVER = 'HOME_TAB_DISCOVER',
  HOME_TAB_FOLLOWING = 'HOME_TAB_FOLLOWING',

  // Search tabs
  SEARCH_TAB_USERS = 'SEARCH_TAB_USERS',
  SEARCH_TAB_POSTS = 'SEARCH_TAB_POSTS',

  // -------------------------------------------------------------------------------------
  // --- POST SCREENS
  // -------------------------------------------------------------------------------------

  POST_CREATE = 'POST_CREATE',
  POST_DETAILS = 'POST_DETAILS',
  POST_REPORT = 'POST_REPORT',

  // Post interactions
  POST_REACTIONS = 'POST_REACTIONS',

  // -------------------------------------------------------------------------------------
  // --- SETTINGS SCREENS
  // -------------------------------------------------------------------------------------

  SETTINGS = 'SETTINGS',
  SETTINGS_SHOW_PRIVATE_KEY = 'SETTINGS_SHOW_PRIVATE_KEY',
  UNLOCK_WALLET = 'UNLOCK_WALLET',
  BLOCKED_USERS = 'BLOCKED_USERS',
  ABOUT = 'ABOUT',
  ABOUT_DETAILS = 'ABOUT_DETAILS',
  REVEAL_PRIVATE_KEY = 'REVEAL_PRIVATE_KEY',

  // -------------------------------------------------------------------------------------
  // --- PROFILE SCREENS
  // -------------------------------------------------------------------------------------

  // Profile visualization
  PROFILE = 'PROFILE',
  GUEST_PROFILE = 'GUEST_PROFILE',

  // Profile creation/saving
  SAVE_PROFILE = 'SAVE_PROFILE',

  // Profile posts
  PROFILE_POSTS = 'PROFILE_POSTS',
  PROFILE_POSTS_POSTS = 'PROFILE_POSTS_POSTS',
  PROFILE_POSTS_LIKED = 'PROFILE_POSTS_LIKED',

  // Profile followage
  PROFILE_CONNECTIONS = 'PROFILE_CONNECTIONS',
  PROFILE_FOLLOWING = 'PROFILE_FOLLOWING',
  PROFILE_FOLLOWERS = 'PROFILE_FOLLOWERS',

  // Profile operations
  PROFILE_OPERATIONS = 'PROFILE_OPERATIONS',

  // -------------------------------------------------------------------------------------
  // --- MODALS
  // -------------------------------------------------------------------------------------

  TEXTONLY_MODAL = 'TEXTONLY_MODAL',
  CONFIRM_MODAL = 'CONFIRM_MODAL',
  SELECT_IMAGE_MODAL = 'SELECT_IMAGE_MODAL',
  BOTTOM_SHEET = 'BOTTOM_SHEET',
  LOADING_MODAL = 'LOADING_MODAL',

  // -------------------------------------------------------------------------------------
  // --- MISC
  // -------------------------------------------------------------------------------------
  LOADING_SCREEN = 'LOADING_SCREEN',
}

export default ROUTES;
