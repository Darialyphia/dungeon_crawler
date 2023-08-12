// return a ref that only triggers when its id property changes
export function useIdRef<T extends { id: string | number }>(value: T) {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        const oldValue = value;
        value = newValue;
        if (value.id !== oldValue.id) {
          trigger();
        }
      },
    };
  });
}
