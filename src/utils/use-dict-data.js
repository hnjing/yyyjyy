import { computed } from 'vue';
import { EleMessage } from '@hnjing/zxzy-admin-plus/es';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { listDictDatas } from '@/api/system/dict-data';

/**
 * 获取字典数据hook
 * @param codes 字典编码
 */
export function useDictData(codes) {
  const result = [];

  // 已缓存的字典
  const userStore = useUserStore();
  const { dicts } = storeToRefs(userStore);

  codes.forEach((code) => {
    result.push(computed(() => dicts.value[code] || []));
    // 若还未缓存过则获取字典数据
    if (dicts.value[code] != null) {
      return;
    }
    userStore.setDicts([], code);
    listDictDatas(code)
      .then((list) => {
        const seen = new Set();
        // 过滤重复数据
        const filteredList = list.filter((item) => {
          const key = `${item.dictValue}-${item.dictType}`;
          if (!seen.has(key)) {
            seen.add(key);
            return true;
          }
          return false;
        });
        userStore.setDicts(filteredList, code);
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  });

  return result;
}
