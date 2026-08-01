import axiosClient from "./axiosClient";

export const RoomApiEtc = {
  getRoomHost: async (roomCode) => {
    const response = await axiosClient.get(
      `/api/rooms/${roomCode}/host`,
    );

    return response.data.data;
  },

  getRoomName: async (roomCode) => {
    const response = await axiosClient.get(
      `/api/rooms/${roomCode}/name`,
    );

    return response.data.data;
  },
};