export const uuidType = 'uuid';
export const uuidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const isUUID = (uuid) => uuidPattern.test(uuid);

export default {
  is: isUUID,
  pattern: uuidPattern,
  type: uuidType,
};
