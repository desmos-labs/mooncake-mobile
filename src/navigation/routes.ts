enum ROUTES {
  // -------------------------------------------------------------------------------------
  // --- INITIAL SCREENS
  // -------------------------------------------------------------------------------------

  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

  // Import account
  IMPORT_ACCOUNT_SELECT_CHAIN = 'IMPORT_ACCOUNT_SELECT_CHAIN',
  IMPORT_ACCOUNT_SELECT_MODE = 'IMPORT_ACCOUNT_SELECT_MODE',
  IMPORT_ACCOUNT_SELECT_LEDGER_APP = 'IMPORT_ACCOUNT_SELECT_LEDGER_APP',
  IMPORT_ACCOUNT_MNEMONIC_INPUT = 'IMPORT_ACCOUNT_MNEMONIC_INPUT',
  IMPORT_ACCOUNT_SELECT_ACCOUNT = 'IMPORT_ACCOUNT_SELECT_ACCOUNT',
  IMPORT_ACCOUNT_SAVE_ACCOUNT = 'IMPORT_ACCOUNT_SAVE_ACCOUNT',

  // -------------------------------------------------------------------------------------
  // --- HOME SCREENS
  // -------------------------------------------------------------------------------------

  // Bottom tabs
  BOTTOM_TABS = 'BOTTOM_TABS',
  CREATE_BUTTON = 'CREATE_BUTTON',
  USER_PROFILE = 'USER_PROFILE',
  COMMUNITIES = 'COMMUNITIES',
  ACTIVITIES = 'ACTIVITIES',

  // Home pages
  HOME_TABS = 'HOME_TABS',
  HOME_DISCOVER = 'HOME_DISCOVER',
  HOME_FOLLOWING = 'HOME_FOLLOWING',

  // -------------------------------------------------------------------------------------
  // --- POST SCREENS
  // -------------------------------------------------------------------------------------

  CREATE_POST = 'CREATE_POST',
  POST_DETAILS = 'POST_DETAILS',
  REPORT_POST = 'REPORT_POST',

  // Post interactions
  POST_INTERACTION = 'POST_INTERACTION',
  POST_REACTIONS = 'POST_REACTIONS',
  POST_TIPS = 'POST_TIPS',

  // -------------------------------------------------------------------------------------
  // --- SETTINGS SCREENS
  // -------------------------------------------------------------------------------------

  SETTINGS = 'SETTINGS',
  SETTINGS_PROFILES = 'SETTINGS_PROFILES',
  SETTINGS_COMMUNITY = 'SETTINGS_COMMUNITY',
  SETTINGS_REVEAL_SECRET_PHRASE = 'SETTINGS_REVEAL_SECRET_PHRASE',
  SETTINGS_SHOW_SECRET_PHRASE = 'SETTINGS_SHOW_SECRET_PHRASE',
  SETTINGS_GRANTS = 'SETTINGS_GRANTS',
  SETTINGS_GRANTS_DETAILS = 'SETTINGS_GRANTS_DETAILS',
  SETTINGS_ENABLE_BIOMETRICS = 'SETTINGS_ENABLE_BIOMETRICS',
  SETTINGS_INVITES = 'SETTINGS_INVITES',
  UNLOCK_WALLET = 'UNLOCK_WALLET',

  // -------------------------------------------------------------------------------------
  // --- CONNECT TO LEDGER SCREENS
  // -------------------------------------------------------------------------------------

  CONNECT_TO_LEDGER_STACK = 'CONNECT_TO_LEDGER_STACK',
  PERFORM_LEDGER_SCAN = 'PERFORM_LEDGER_SCAN',
  CONNECT_TO_LEDGER = 'CONNECT_TO_LEDGER',

  // -------------------------------------------------------------------------------------
  // --- CHAIN LINKS SCREENS
  // -------------------------------------------------------------------------------------

  MANAGE_CONNECTED_CHAINS = 'MANAGE_CONNECTED_CHAINS',

  // Connect chain
  CONNECT_ADDRESS_GENERAL = 'CONNECT_ADDRESS_GENERAL',
  CONNECT_ADDRESS_ADVANCED = 'CONNECT_ADDRESS_ADVANCED',

  // Disconnect chain
  DISCONNECT_CHAIN_MODAL = 'DISCONNECT_CHAIN_MODAL',

  // -------------------------------------------------------------------------------------
  // --- APP LINKS SCREENS
  // -------------------------------------------------------------------------------------

  MANAGE_CONNECTED_APPS = 'MANAGE_CONNECTED_APPS',
  CONNECT_APP = 'CONNECT_APP',

  // Disconnect app modal
  DISCONNECT_APP_MODAL = 'DISCONNECT_APP_MODAL',

  // Twitter connection
  SELECT_TWEET = 'SELECT_TWEET',

  // -------------------------------------------------------------------------------------
  // --- PROFILE SCREENS
  // -------------------------------------------------------------------------------------

  // Profile addition
  ADD_PROFILE = 'ADD_PROFILE',
  ADD_PROFILE_SELECT_ADDRESS_GENERAL = 'ADD_PROFILE_SELECT_ADDRESS_GENERAL',
  ADD_PROFILE_SELECT_ADDRESS_ADVANCED = 'ADD_PROFILE_SELECT_ADDRESS_ADVANCED',
  ADD_PROFILE_MODAL = 'ADD_PROFILE_MODAL',

  // Profile creation/saving
  SAVE_PROFILE = 'SAVE_PROFILE',

  // Profile posts
  PROFILE_POSTS = 'PROFILE_POSTS',
  PROFILE_POSTS_POSTS = 'PROFILE_POSTS_POSTS',
  PROFILE_POSTS_LIKED = 'PROFILE_POSTS_LIKED',
  PROFILE_POSTS_TIPPED = 'PROFILE_POSTS_TIPPED',

  // Profile followage
  FOLLOWING_AND_FOLLOWERS = 'FOLLOWING_AND_FOLLOWERS',
  FOLLOWING = 'FOLLOWING',
  FOLLOWERS = 'FOLLOWERS',

  // -------------------------------------------------------------------------------------
  // --- INVITE SCREENS
  // -------------------------------------------------------------------------------------
  MANAGE_INVITES = 'MANAGE_INVITES',

  // -------------------------------------------------------------------------------------
  // --- OTHER SCREENS
  // --- TODO: Categorize them as well
  // -------------------------------------------------------------------------------------

  BACKUP_PHRASE_BOTTOM_MODAL = 'BACKUP_PHRASE_BOTTOM_MODAL',

  PASSWORD_MANIPULATION = 'PASSWORD_MANIPULATION',

  CONFIRM_MODAL = 'CONFIRM_MODAL',

  TEXTONLY_MODAL = 'TEXTONLY_MODAL',

  CHECK_MNEMONIC = 'CHECK_MNEMONIC',

  WELCOME_PAGE = 'WELCOME_PAGE',

  FULLSCREEN_STATUS_SCREEN = 'FULLSCREEN_STATUS_SCREEN',

  CONSENT_AGREEMENT = 'CONSENT_AGREEMENT',

  SEND_TIPS = 'SEND_TIPS',

  BOTTOM_MODAL = 'BOTTOM_MODAL',

  DEV_SCREEN = 'DEV_SCREEN',

  BROADCAST_TX_ON_CHAIN = 'BROADCAST_TX_ON_CHAIN',

  NO_DTAG_FOUND = 'NO_DTAG_FOUND',

  CONFIRM_ADDRESS = 'CONFIRM_ADDRESS',

  WELCOME_BACK = 'WELCOME_BACK',

  ACTION_AUTHORIZATION = 'ACTION_AUTHORIZATION',

  PROFILE_NFTS = 'PROFILE_NFTS',

  NFT_DETAILS = 'NFT_DETAILS',

  GUEST_PROFILE = 'GUEST_PROFILE',

  IMPACT_POINTS_MODAL = 'IMPACT_POINTS_MODAL',

  ONBOARDING = 'ONBOARDING',

  MANAGE_CONNECTIONS_MODAL = 'MANAGE_CONNECTIONS_MODAL',

  CONVERTIBLE_POINTS_MODAL = 'CONVERTIBLE_POINTS_MODAL',

  OPERATIONS = 'OPERATIONS',
}

export default ROUTES;
