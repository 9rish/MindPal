// Enhanced MyChat.jsx
import React, { useEffect, useState } from "react";
import { FaPenAlt, FaUsers } from "react-icons/fa";
import { HiPlus, HiSearch } from "react-icons/hi";
import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    setChatLoading,
    setGroupChatBox,
} from "../../redux/slices/conditionSlice";
import ChatShimmer from "../loading/ChatShimmer";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { VscCheckAll } from "react-icons/vsc";
import { SimpleDateAndTime, SimpleTime } from "../../utils/formateDateTime";

const MyChat = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredChats, setFilteredChats] = useState([]);
    const dispatch = useDispatch();
    const myChat = useSelector((store) => store.myChat.chat);
    const authUserId = useSelector((store) => store?.auth?._id);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const isChatLoading = useSelector(
        (store) => store?.condition?.isChatLoading
    );
    const newMessageId = useSelector((store) => store?.message?.newMessageId);
    const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);

    // Filter chats based on search term
    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = myChat.filter(chat => 
                getChatName(chat, authUserId)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (chat.latestMessage?.message || '')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
            setFilteredChats(filtered);
        } else {
            setFilteredChats(myChat);
        }
    }, [searchTerm, myChat, authUserId]);

    // All My Chat Api Call
    useEffect(() => {
        const getMyChat = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addMyChat(json?.data || []));
                    dispatch(setChatLoading(false));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setChatLoading(false));
                });
        };
        getMyChat();
    }, [newMessageId, isGroupChatId]);

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 border-r border-slate-600 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <FaUsers className="text-sm text-white" />
                        </div>
                        My Chats
                    </h1>
                    <button
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        title="Create New Group"
                        onClick={() => dispatch(setGroupChatBox())}
                    >
                        <HiPlus className="text-sm" />
                        <span className="hidden sm:inline">New Group</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredChats.length == 0 && isChatLoading ? (
                    <ChatShimmer />
                ) : (
                    <>
                        {filteredChats?.length === 0 && !isChatLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                                    <FaUsers className="text-2xl text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {searchTerm ? 'No chats found' : 'No conversations yet'}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {searchTerm ? 'Try a different search term' : 'Start a new conversation to get started'}
                                </p>
                            </div>
                        )}
                        {filteredChats?.map((chat) => {
                            const isSelected = selectedChat?._id === chat?._id;
                            const hasUnread = Math.random() > 0.7; // Simulate unread status
                            
                            return (
                                <div
                                    key={chat?._id}
                                    className={`relative w-full p-3 rounded-xl transition-all duration-300 cursor-pointer group ${
                                        isSelected
                                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg shadow-blue-500/10"
                                            : "hover:bg-slate-700/50 border border-transparent hover:border-slate-600/50"
                                    }`}
                                    onClick={() => dispatch(addSelectedChat(chat))}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar with Status */}
                                        <div className="relative">
                                            <img
                                                className="h-12 w-12 rounded-full border-2 border-slate-600 object-cover"
                                                src={getChatImage(chat, authUserId)}
                                                alt="Chat avatar"
                                            />
                                            {/* Online Status Indicator */}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-800 rounded-full"></div>
                                            {hasUnread && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                            )}
                                        </div>

                                        {/* Chat Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`font-semibold truncate ${
                                                    isSelected ? 'text-white' : 'text-gray-200'
                                                }`}>
                                                    {getChatName(chat, authUserId)}
                                                </h3>
                                                <span className={`text-xs ml-2 ${
                                                    isSelected ? 'text-blue-300' : 'text-gray-400'
                                                }`}>
                                                    {chat?.latestMessage &&
                                                        SimpleTime(chat?.latestMessage?.createdAt)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1 mt-1">
                                                {chat?.latestMessage ? (
                                                    <>
                                                        {chat?.latestMessage?.sender?._id === authUserId && (
                                                            <VscCheckAll
                                                                className={`text-sm ${
                                                                    isSelected ? 'text-blue-300' : 'text-gray-400'
                                                                }`}
                                                            />
                                                        )}
                                                        <span className={`text-sm truncate ${
                                                            isSelected ? 'text-gray-300' : 'text-gray-400'
                                                        }`}>
                                                            {chat?.latestMessage?.message}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className={`text-sm ${
                                                        isSelected ? 'text-gray-300' : 'text-gray-400'
                                                    }`}>
                                                        {SimpleDateAndTime(chat?.createdAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Unread Badge */}
                                        {hasUnread && !isSelected && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyChat;