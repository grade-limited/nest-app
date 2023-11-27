function toBoolean(value: any) {
  return value !== null && value !== undefined
    ? ['true', 'True', true, 1].includes(value)
      ? true
      : ['false', 'False', false, 0].includes(value)
      ? false
      : undefined
    : undefined;
}

export default toBoolean;
