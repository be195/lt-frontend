export { };

declare global {
  interface ChatSendResponse {
    success: boolean,
    msg?: string,
    entername?: boolean
  }

  interface ChatInfoResponse {
    canchat: boolean,
    shouldlogin: boolean,
    loggedin: string | false
  }

  interface StreamListInfo {
    name: string,
    id: string,
    status: string
  }

  interface StreamInfo {
    name: string,
    privacy: boolean,
    chatmode: 'pub' | 'reg' | 'pri',
    wurl: string
  }

  interface Peers {
    [key: string]: string
  }

  interface GetPeersResponse {
    success: boolean,
    peers?: Peers
  }

  interface GetKeyResponse {
    success: boolean,
    msg?: string,
    key?: string
  }
};