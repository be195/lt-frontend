export  enum StreamStatsOpCodes {
  STREAM_STATUS = 0,
  WATCHERS_UPDATE = 1,
  CHAT_MESSAGE = 2,
  STREAM_STATS = 3
}

export enum StreamViewerStates {
  SHOW_ERROR_BANNER = 'streamShowErrorBanner',
  ERROR_STRING = 'streamErrorString',
  ERROR_COUNTDOWN_TIME = 'streamErrorCountdownTime'
}

export enum LocalStorageKeys {
  LANGUAGE = 'language',
  REDUCED_MOTION = 'reducedMotion'
}