interface SelfInfo {
  login: string,
  isadmin: boolean,
  sessioncount: number,
  pending?: true
};

const data = ref<SelfInfo>({
  login: '...',
  isadmin: false,
  sessioncount: 1,
  pending: true
});
let lock = false;

export function useSelfInfo() {
  if (lock)
    return data;

  lock = true;
  $fetch<SelfInfo>('/api/web/ownuserinfo').then(userInfo =>
    data.value = userInfo
  );

  return data;
}