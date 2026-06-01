import api from "./api"

// Fetch existing messages for a room
export const getMessages = (room_id) => {
  return api.get(`messages/?room_id=${room_id}`);
};

// Send a new message to a room
export const sendMessage = (room_id, content) => {
  return api.post(`messages/`, {
    room: room_id,
    content: content 
  });
};

// Upload a file message (encrypted or plain)
export const uploadFileMessage = (formData) => {
  return api.post(`messages/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};