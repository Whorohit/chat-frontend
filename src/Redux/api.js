// api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
    }),
    tagTypes: ['Chat', 'User', 'Message'],
    endpoints: (builder) => ({
        friendslistinfo: builder.query({
            query: () => ({
                url: 'api/user/friendlist',
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
        Searchuser: builder.query({
            query: (name) => ({
                url: `api/user/search?name=${name}`,
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
        newGroup: builder.mutation({
            query: ({ name, members, avatar }) => {
                console.log(avatar);

                const formData = new FormData();
                formData.append('name', name);
                members.forEach((member) => {
                    formData.append('member', member);
                }); // Convert array to string for FormData
                if (avatar) {
                    formData.append('avatar', avatar);  // Append file to formData
                }

                return {
                    url: `api/chat/newgroup`,
                    method: "POST",
                    credentials: "include",
                    body: formData,
                };
            },
            invalidatesTags: ["Chat"]
        }),
        mychats: builder.query({
            query: () => ({
                url: `api/chat/getmychats`,
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
        chatsdetails: builder.query({
            query: ({ chatId, populate = true }) => {
                let url = `api/chat/chatdetails/${chatId}`;
                if (populate) {
                    url += "?populate=true"
                }

                return {

                    url: url,
                    credentials: 'include',

                }
            },
            providesTags: ["Chat"]
        }),
        getmessages: builder.mutation({
            query: ({ chatId, page }) => ({
                url: `api/chat/messages/${chatId}`,
                method: 'POST',
                body: { page, limit: 20 },
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }),
            keepUnusedDataFor: 0,

        }),
        sendattachment: builder.mutation({
            query: (data) => ({
                url: `api/chat/sendattachment`,
                method: "POST",
                body: data,
                credentials: "include",

            }),
            invalidatesTags: ["Chat"]
        }),
        viewuserprofile: builder.query({
            query: (id) => ({
                url: `api/user/viewprofile/${id}`,
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
        getmygroups: builder.query({
            query: (id) => ({
                url: `api/chat/getmygroups`,
                credentials: 'include',
            }),
            providesTags: ['Chat'],
        }),
        Updategroupdetails: builder.mutation({
            query: (data) => {
                console.log(data);

                return {
                    url: `api/chat/editgroupdetails`,
                    method: "PUT",
                    credentials: "include",
                    body: data,
                }

            },
            invalidatesTags: ["Chat"]
        }),
        removeGroupmember: builder.mutation({
            query: ({ chatId, userId }) => {


                return {
                    url: `api/chat/removemember`,
                    method: "DELETE",
                    credentials: "include",
                    body: { chatid: chatId, userid: userId },
                }
            },
            invalidatesTags: ["Chat"]
        }),

        addnewmembers: builder.mutation({
            query: ({ chatId, member }) => {
                console.log(member);


                return {
                    url: `api/chat/addmembers`,
                    method: "PUT",
                    credentials: "include",
                    body: { chatid: chatId, newmembers: member },
                }
            },
            invalidatesTags: ["Chat"]
        }),
        modifyAdmins: builder.mutation({
            query: ({ chatId, userId, add }) => {


                return {
                    url: `api/chat/changeadmins`,
                    method: "PUT",
                    credentials: "include",
                    body: { chatid: chatId, userid: userId, add },
                }
            },
            invalidatesTags: ["Chat"]
        }),
        leavegroup: builder.mutation({
            query: ({ chatId }) => {


                return {
                    url: `api/chat/leave/${chatId}`,
                    method: "DELETE",
                    credentials: "include",
                }
            },
            invalidatesTags: ["Chat"]
        }),
        viewmyprofile: builder.query({
            query: () => ({
                url: `api/user/myprofile`,
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
        Updateprofile: builder.mutation({
            query: (data) => {


                return {
                    url: `api/user/editinfo`,
                    method: "PUT",
                    credentials: "include",
                    body: data,
                }

            },
            invalidatesTags: ['User']
        }),
        Updatepassword: builder.mutation({
            query: (data) => {
                console.log(data);
                console.log(data);

                return {
                    url: `api/user/changepassword`,
                    method: "PUT",
                    credentials: "include",
                    body: data,
                }

            },
            invalidatesTags: ['User']
        }),
        SendRequest: builder.mutation({
            query: ({ reqid }) => {

                return {
                    url: `api/user/sendrequest`,
                    method: "POST",
                    credentials: "include",
                    body: { reqid: reqid },
                }

            },
            invalidatesTags: ['User']
        }),
        getallnotifications: builder.query({
            query: () => {

                return {
                    url: `api/user/getallnotification`,
                    method: "GET",
                    credentials: "include",
                }

            },
            providesTags: ['User'],
            invalidatesTags: ['User']
        }),
        AcceptRequest: builder.mutation({
            query: ({ reqid, accept }) => {

                return {
                    url: `api/user/acceptrequest`,
                    method: "POST",
                    credentials: "include",
                    body: { requestid: reqid, accept: accept },
                }

            },
            invalidatesTags: ['User']
        }),
        RemoveNotification: builder.mutation({
            query: ({ reqid, }) => {

                return {
                    url: `api/user/removenotifications`,
                    method: "DELETE",
                    credentials: "include",
                    body: { notificatonid: reqid },
                }

            },
            invalidatesTags: ['User']
        }),
        logout: builder.query({
            query: () => {

                return {
                    url: `api/user/logout`,
                    method: "GET",
                    credentials: "include",
                }

            },
            invalidatesTags: ['User','Chat']
        }),
        getallcall:builder.query({
            query: () => {

                return {
                    url: `api/chat/getallcall`,
                    method: "GET",
                    credentials: "include",
                }

            },
            invalidatesTags: ['User','Chat']
        }),



    }),


});

export default api;
export const { useLazyFriendslistinfoQuery, useLazySearchuserQuery, useNewGroupMutation, useMychatsQuery, useChatsdetailsQuery, useGetmessagesMutation, useSendattachmentMutation, useLazyViewuserprofileQuery, useGetmygroupsQuery, useUpdategroupdetailsMutation, useRemoveGroupmemberMutation, useAddnewmembersMutation, useModifyAdminsMutation, useLeavegroupMutation, useViewmyprofileQuery, useLazyViewmyprofileQuery, useUpdateprofileMutation, useUpdatepasswordMutation, useSendRequestMutation, useLazyGetallnotificationsQuery, useAcceptRequestMutation, useRemoveNotificationMutation, useGetallnotificationsQuery,useLazyLogoutQuery,useGetallcallQuery } = api; // Ensure this export is correct
