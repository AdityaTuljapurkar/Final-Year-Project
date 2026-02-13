import api from "./api"


export const getMessages = (room_id) => {
  return api.get(`messages/?room_id=${room_id}`);
};
    