enum ROUTES {
  // -------------------------------------------------------------------------------------
  // --- INITIAL SCREENS
  // -------------------------------------------------------------------------------------

  ONBOARDING = 'ONBOARDING',
  LANDING = 'LANDING',
  CONSENT_AGREEMENT = 'CONSENT_AGREEMENT',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  WELCOME = 'WELCOME',
  WELCOME_BACK = 'WELCOME',

  // Development
  DEV_SCREEN = 'DEV_SCREEN',

  // -------------------------------------------------------------------------------------
  // --- BROADCAST TRANSACTION SCREENS
  // -------------------------------------------------------------------------------------

  BROADCAST_TX_ON_CHAIN = 'BROADCAST_TX_ON_CHAIN',

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

  // Import account
  IMPORT_ACCOUNT_SELECT_CHAIN = 'IMPORT_ACCOUNT_SELECT_CHAIN',
  IMPORT_ACCOUNT_SELECT_MODE = 'IMPORT_ACCOUNT_SELECT_MODE',
  IMPORT_ACCOUNT_SELECT_LEDGER_APP = 'IMPORT_ACCOUNT_SELECT_LEDGER_APP',
  IMPORT_ACCOUNT_MNEMONIC_INPUT = 'IMPORT_ACCOUNT_MNEMONIC_INPUT',
  IMPORT_ACCOUNT_SELECT_PROFILE = 'IMPORT_ACCOUNT_SELECT_PROFILE',
  IMPORT_ACCOUNT_SAVE_ACCOUNT = 'IMPORT_ACCOUNT_SAVE_ACCOUNT',

  // Account password
  PASSWORD_MANIPULATION = 'PASSWORD_MANIPULATION',

  // -------------------------------------------------------------------------------------
  // --- HOME SCREENS
  // -------------------------------------------------------------------------------------

  // Bottom tabs
  BOTTOM_TABS = 'BOTTOM_TABS',
  CREATE_BUTTON = 'CREATE_BUTTON',
  COMMUNITIES = 'COMMUNITIES',
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

  // Profile visualization
  PROFILE = 'PROFILE',
  GUEST_PROFILE = 'GUEST_PROFILE',

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

  MANAGE_INVITES = 'MANAGE_INVITES',
  IMPACT_POINTS_MODAL = 'IMPACT_POINTS_MODAL',
  MANAGE_CONNECTIONS_MODAL = 'MANAGE_CONNECTIONS_MODAL',

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

  // -------------------------------------------------------------------------------------
  // --- OTHER SCREENS
  // --- TODO: Categorize them as well
  // -------------------------------------------------------------------------------------

  NFT_DETAILS = 'NFT_DETAILS',
}

export default ROUTES;
