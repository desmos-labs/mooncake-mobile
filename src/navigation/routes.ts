enum ROUTES {
  // -------------------------------------------------------------------------------------
  // --- INITIAL SCREENS
  // -------------------------------------------------------------------------------------

  ONBOARDING = 'ONBOARDING',
  LANDING = 'LANDING',
  WELCOME = 'WELCOME',
  SERVICE_AND_POLICY = 'SERVICE_AND_POLICY',
  WELCOME_PAGE = 'WELCOME_PAGE',
  FEE_GRANT_WAITING_SCREEN = 'FEE_GRANT_WAITING_SCREEN',

  // Development
  DEV_SCREEN = 'DEV_SCREEN',

  // -------------------------------------------------------------------------------------
  // --- BROADCAST TRANSACTION SCREENS
  // -------------------------------------------------------------------------------------

  TX_LOADING = 'TX_LOADING',

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

  // Import account
  IMPORT_ACCOUNT_SELECT_PROFILE = 'IMPORT_ACCOUNT_SELECT_PROFILE',
  IMPORT_ACCOUNT_SAVE_ACCOUNT = 'IMPORT_ACCOUNT_SAVE_ACCOUNT',
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

  // Home pages
  HOME_TABS = 'HOME_TABS',
  HOME_TAB_DISCOVER = 'HOME_TAB_DISCOVER',
  HOME_TAB_FOLLOWING = 'HOME_TAB_FOLLOWING',

  // -------------------------------------------------------------------------------------
  // --- POST SCREENS
  // -------------------------------------------------------------------------------------

  POST_CREATE = 'POST_CREATE',
  POST_DETAILS = 'POST_DETAILS',
  POST_REPORT = 'POST_REPORT',
  POST_SEND_TIPS = 'POST_SEND_TIPS',

  // Post interactions
  POST_INTERACTION = 'POST_INTERACTION',
  POST_REACTIONS = 'POST_REACTIONS',
  POST_TIPS = 'POST_TIPS',

  // -------------------------------------------------------------------------------------
  // --- SETTINGS SCREENS
  // -------------------------------------------------------------------------------------

  SETTINGS = 'SETTINGS',
  SETTINGS_COMMUNITY = 'SETTINGS_COMMUNITY',
  SETTINGS_SHOW_PRIVATE_KEY = 'SETTINGS_SHOW_PRIVATE_KEY',
  SETTINGS_ENABLE_BIOMETRICS = 'SETTINGS_ENABLE_BIOMETRICS',
  UNLOCK_WALLET = 'UNLOCK_WALLET',
  BLOCKED_USERS = 'BLOCKED_USERS',

  // -------------------------------------------------------------------------------------
  // --- PROFILE SCREENS
  // -------------------------------------------------------------------------------------

  // Profile visualization
  PROFILE = 'PROFILE',
  GUEST_PROFILE = 'GUEST_PROFILE',

  // Profile addition
  ADD_PROFILE_MODAL = 'ADD_PROFILE_MODAL',

  // Profile creation/saving
  SAVE_PROFILE = 'SAVE_PROFILE',

  // Profile posts
  PROFILE_POSTS = 'PROFILE_POSTS',
  PROFILE_POSTS_POSTS = 'PROFILE_POSTS_POSTS',
  PROFILE_POSTS_LIKED = 'PROFILE_POSTS_LIKED',
  PROFILE_POSTS_TIPPED = 'PROFILE_POSTS_TIPPED',

  // Profile followage
  PROFILE_CONNECTIONS = 'PROFILE_CONNECTIONS',
  PROFILE_FOLLOWING = 'PROFILE_FOLLOWING',
  PROFILE_FOLLOWERS = 'PROFILE_FOLLOWERS',

  // Profile operations
  PROFILE_OPERATIONS = 'PROFILE_OPERATIONS',

  // Profile NFTs
  PROFILE_NFTS = 'PROFILE_NFTS',

  // -------------------------------------------------------------------------------------
  // --- INVITE SCREENS
  // -------------------------------------------------------------------------------------

  IMPACT_POINTS_MODAL = 'IMPACT_POINTS_MODAL',

  // -------------------------------------------------------------------------------------
  // --- MODALS
  // -------------------------------------------------------------------------------------

  TEXTONLY_MODAL = 'TEXTONLY_MODAL',
  CONFIRM_MODAL = 'CONFIRM_MODAL',
  BOTTOM_MODAL = 'BOTTOM_MODAL',
  BACKUP_PHRASE_BOTTOM_MODAL = 'BACKUP_PHRASE_BOTTOM_MODAL',
  CONVERTIBLE_POINTS_MODAL = 'CONVERTIBLE_POINTS_MODAL',
  UPLOAD_PROFILE_PICTURES_MODALS = 'UPLOAD_PROFILE_PICTURES_MODALS',
  AUTHORIZATION_MODAL = 'AUTHORIZATION_MODAL',
  SELECT_IMAGE_MODAL = 'SELECT_IMAGE_MODAL',

  // -------------------------------------------------------------------------------------
  // --- OTHER SCREENS
  // --- TODO: Categorize them as well
  // -------------------------------------------------------------------------------------

  NFT_DETAILS = 'NFT_DETAILS',
}

export default ROUTES;
