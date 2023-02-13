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
  UNLOCK_WALLET = 'UNLOCK_WALLET',

  // -------------------------------------------------------------------------------------
  // --- AUTHORIZE WALLET SCREENS
  // -------------------------------------------------------------------------------------

  AUTHORIZE_WALLET = 'AUTHORIZE_WALLET',
  AUTH_LOOKING_FOR_DEVICES = 'AUTH_LOOKING_FOR_DEVICES',
  AUTH_CONNECT_TO_LEDGER = 'AUTH_CONNECT_TO_LEDGER',
  AUTH_UNLOCK_LOCAL_WALLET = 'AUTH_UNLOCK_LOCAL_WALLET',

  // -------------------------------------------------------------------------------------
  // --- CONNECT TO LEDGER SCREENS
  // -------------------------------------------------------------------------------------

  CONNECT_TO_LEDGER_STACK = 'CONNECT_TO_LEDGER_STACK',
  PERFORM_LEDGER_SCAN = 'PERFORM_LEDGER_SCAN',
  CONNECT_TO_LEDGER = 'CONNECT_TO_LEDGER',

  // -------------------------------------------------------------------------------------
  // --- CHAIN LINKS SCREEN
  // -------------------------------------------------------------------------------------

  // Connect chain
  CONNECT_ADDRESS_GENERAL = 'CONNECT_ADDRESS_GENERAL',
  CONNECT_ADDRESS_ADVANCED = 'CONNECT_ADDRESS_ADVANCED',
  CONNECT_CHAIN_METHOD = 'CONNECT_CHAIN_METHOD',
  CONNECT_CHAIN_TX_DETAIL = 'CONNECT_CHAIN_TX_DETAIL',

  // Disconnect chain
  DISCONNECT_CHAIN_MODAL = 'DISCONNECT_CHAIN_MODAL',
  DISCONNECT_APP_MODAL = 'DISCONNECT_APP_MODAL',

  // -------------------------------------------------------------------------------------
  // --- PROFILE SCREEN
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
  // --- APPLICATION LINKS SCREEN
  // -------------------------------------------------------------------------------------

  CONNECT_APP = 'CONNECT_APP',

  // Twitter connection
  SELECT_TWEET = 'SELECT_TWEET',

  // -------------------------------------------------------------------------------------
  // --- OTHER SCREENS
  // --- TODO: Categorize them as well
  // -------------------------------------------------------------------------------------

  BACKUP_PHRASE_BOTTOM_MODAL = 'BACKUP_PHRASE_BOTTOM_MODAL',

  MANAGE_CONNECTED_CHAINS = 'MANAGE_CONNECTED_CHAINS',

  MANAGE_CONNECTED_APPS = 'MANAGE_CONNECTED_APPS',

  PASSWORD_MANIPULATION = 'PASSWORD_MANIPULATION',

  CONFIRM_MODAL = 'CONFIRM_MODAL',

  TEXTONLY_MODAL = 'TEXTONLY_MODAL',

  MNEMONIC_INPUT = 'MNEMONIC_INPUT',

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

  SELECT_LEDGER_APP = 'SELECT_LEDGER_APP',

  ACTION_AUTHORIZATION = 'ACTION_AUTHORIZATION',

  PROFILE_NFTS = 'PROFILE_NFTS',

  NFT_DETAILS = 'NFT_DETAILS',

  GUEST_PROFILE = 'GUEST_PROFILE',

  // Grants
  GRANTS = 'GRANTS',
  GRANTS_DETAILS = 'GRANTS_DETAILS',

  // Biometrics
  MANAGE_BIOMETRICS = 'MANAGE_BIOMETRICS',

  // Invites
  INVITES = 'INVITES',
  MANAGE_INVITES = 'MANAGE_INVITES',

  IMPACT_POINTS_MODAL = 'IMPACT_POINTS_MODAL',

  ONBOARDING = 'ONBOARDING',

  MANAGE_CONNECTIONS_MODAL = 'MANAGE_CONNECTIONS_MODAL',

  CONVERTIBLE_POINTS_MODAL = 'CONVERTIBLE_POINTS_MODAL',

  OPERATIONS = 'OPERATIONS',
}

export default ROUTES;
