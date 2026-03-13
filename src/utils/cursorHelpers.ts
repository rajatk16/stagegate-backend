export const encodeCursor = (limit: number, offset: number) =>
  Buffer.from(`${offset}~${limit}`).toString('base64');

export const decodeCursor = (cursor: string) => {
  const decodedParts = Buffer.from(cursor, 'base64').toString('utf8').split('~');

  if (decodedParts.length !== 2) throw new Error('Invalid cursor');

  return {
    offset: parseInt(decodedParts[0]),
    limit: parseInt(decodedParts[1]),
  };
};
