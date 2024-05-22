export default function(str?: string) {
  return computed(() => {
    const classes: Record<string, boolean> = {};

    if (str)
      for (const cl of str.split(' '))
        classes[cl] = true;

    return classes;
  });
}