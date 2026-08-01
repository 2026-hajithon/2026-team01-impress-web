import axiosClient from ".";

export const RoomAPI = {
  /**
   *
   * @param {String} hostName
   * @param {String} roomName
   * @returns {{roomCode: String, participantId: String, role: String}}
   */
  createRoom: async (hostName, roomName) => {
    const response = await axiosClient.post("/api/rooms", {
      hostName: hostName,
      roomName: roomName,
    });
    return response.data;
  },

  /**
   *
   * @param {String} roomCode
   * @param {String} name
   * @returns {{participantId: String, roomStatus: String, role: String}}
   */
  participateRoom: async (roomCode, name) => {
    const response = await axiosClient.post(`/api/rooms/${roomCode}/join`, {
      name: name,
    });
    return response.data;
  },

  /**
   *
   * @param {String} roomCode
   * @returns
   */
  getResult: async (roomCode) => {
    const response = await axiosClient.get(`/api/rooms/${roomCode}/result`);
    return response.data;
  },

  /**
   *
   * @param {String} roomCode
   * @returns
   */
  getQuestions: async (roomCode) => {
    const response = await axiosClient.get(`/api/rooms/${roomCode}/questions`);
    return response.data;
  },

  /**
   *
   * @param {String} roomCode
   * @returns {{roomStatus: String, myRole: String, participants: {participantId: String, name: String, role: String}[]} |
   * {roomStatus: String, myRole: String, currentRoundOrder: Number, qType: String, phase: String, timeRemaining: Number, myAnswerSubmitted: boolean, question: String, targetId: String}}
   */
  syncStatus: async (roomCode, participantId) => {
    const response = await axiosClient.get(`/api/rooms/${roomCode}/sync`, {
      headers: {
        "Participant-Id": participantId,
      },
    });
    return response.data;
  },

  /**
   *
   * @param {String} roomCode
   * @param {String} partipantId
   * @returns {{success: boolean}}
   */
  leaveRoom: async (roomCode, partipantId) => {
    const response = await axiosClient.delete(
      `/api/rooms/${roomCode}/partipants/me`,
      {
        headers: { participantId: partipantId },
      },
    );
    return response.data;
  },
};
