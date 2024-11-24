import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    localref: null,
    remoteref: null,
    rejectcall: null,
    peerconnectionref: null,
    localstreamref: null,
    isCallbox: false,
    isNewGroup: false,
    isAddMember: false,
    isFriendList: false,
    isNotification: false,
    isMoblieMenuFriend: false,
    isCreategroup: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    uploadLoader: false,
    issnackbar: false,
    selectedDeleteChat: {
        _id: "",
        groupchats: false
    },
    rejectcalltext: "",
    onlineuser: []
}

const misslice = createSlice({
    name: "misc",
    initialState,  // Corrected the key here
    reducers: {
        setIsNotification: (state, action) => {
            state.isNotification = action.payload;
        },
        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload;
        },
        setIsSnackbar: (state, action) => {
            state.issnackbar = action.payload;
        },
        setIsAddmember: (state, action) => {
            state.isAddMember = action.payload;
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload
        },
        setIsFriendlist: (state, action) => {
            state.isFriendList = action.payload;
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload;
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload;
        },
        setIsCreateGroup: (state, action) => {
            state.isCreategroup = action.payload;
        },
        addMember: (state, action) => {
            const memberId = action.payload;
            if (!state.onlineuser.includes(memberId)) {
                state.onlineuser.push(memberId);  // Add the member ID
            }
        },
        // Remove member reducer
        removeMember: (state, action) => {
            const memberId = action.payload;
            state.onlineuser = state.onlineuser.filter(id => id !== memberId);  // Remove the member ID
        },
        newlist: (state, action) => {
            state.onlineuser = action.payload
        },
        setIsCalling: (state, action) => {
            state.isCallbox = action.payload
        },
        setlocalref: (state, action) => {
            console.log("hhhhfff");
            state.localref = action.payload
        },
        setremoteref: (state, action) => {
            console.log("hhhhfff");

            state.remoteref = action.payload
        },
        setPeerConnection(state, action) {
            state.peerconnectionref = action.payload;
        },
        clearPeerConnection: (state) => {
            if (state.peerconnectionref.connection) {
                state.peerconnectionref.connection.close(); // Close the connection when clearing
            }
            state.peerconnectionref.connection = null;
        },
        setrejectcall: (state, action) => {
            state.rejectcall = action.payload
        },
        setrejectcalltext: (state, action) => {
            state.rejectcalltext = action.payload
        },

    }
});

export default misslice;

export const { setIsNotification, setIsNewGroup, setIsFriendlist, setIsSearch, setIsCreateGroup, addMember, removeMember, newlist, setIsFileMenu, setIsAddmember, setIsCalling, setlocalref, setremoteref, setPeerConnection, clearPeerConnection, setrejectcall,setrejectcalltext } = misslice.actions;