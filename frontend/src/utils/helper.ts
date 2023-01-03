export const tuple = <T extends unknown[]>(...ts: T): T => {
  return ts;
};
