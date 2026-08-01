export const PARTICIPANT_ROLE = Object.freeze({
  HOST: "HOST",
  GUEST: "GUEST",
});

export const isHostRole = (role) => role === PARTICIPANT_ROLE.HOST;
