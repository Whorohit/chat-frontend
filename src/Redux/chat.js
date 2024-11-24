import { createSlice } from '@reduxjs/toolkit';
import { getorsavefromstorage } from '../features/feature';

const initialState = {

  noitificationcount: 0,
  alertarray: getorsavefromstorage({ key: "NEW_MESSAGE_ALERT", get: true }) || [
    {
      chatId: "",
      count: 0
    },
  ]

}

const chatslice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    increasenotification: (state, action) => {
      state.noitificationcount++;

    },
    decreasenotification: (state) => {
      state.noitificationcount--;
    },
    resetnotifiction: (state) => {
      state.noitificationcount = 0;
    },
    setnewmessagealert: (state, action) => {
      const index = state.alertarray.findIndex((item) => item.chatId === action.payload.chatId);
      if (index !== -1) {
        state.alertarray[index].count += 1;
      }
      else {
        state.alertarray.push({
          chatId: action.payload.chatId,
          count: 1
        })
      }
    }
    , removenewmessagealert: (state, action) => {
      console.log(action.payload);

      state.alertarray = state.alertarray.filter((item) => item.chatId !== action.payload)
    }

  }

});

export const { increasenotification, setnewmessagealert, removenewmessagealert, decreasenotification,resetnotifiction } = chatslice.actions;

export default chatslice.reducer;

