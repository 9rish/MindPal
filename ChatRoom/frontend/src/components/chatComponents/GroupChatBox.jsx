// Enhanced GroupChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	setChatLoading,
	setGroupChatBox,
	setGroupChatId,
	setLoading,
} from "../../redux/slices/conditionSlice";
import { MdOutlineClose, MdGroupAdd } from "react-icons/md";
import { FaSearch, FaUsers } from "react-icons/fa";
import { HiX, HiPlus } from "react-icons/hi";
import ChatShimmer from "../loading/ChatShimmer";
import { handleScrollEnd } from "../../utils/handleScrollTop";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const GroupChatBox = () => {
	const groupUser = useRef("");
	const dispatch = useDispatch();
	const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
	const authUserId = useSelector((store) => store?.auth?._id);
	const [isGroupName, setGroupName] = useState("");
	const [users, setUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isGroupUsers, setGroupUsers] = useState([]);

	// All Users Api Call
	useEffect(() => {
		const getAllUsers = () => {
			dispatch(setChatLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((json) => {
					setUsers(json.data || []);
					setSelectedUsers(json.data || []);
					dispatch(setChatLoading(false));
				})
				.catch((err) => {
					console.log(err);
					dispatch(setChatLoading(false));
				});
		};
		getAllUsers();
	}, []);

	useEffect(() => {
		setSelectedUsers(
			users.filter((user) => {
				return (
					user.firstName.toLowerCase().includes(inputUserName?.toLowerCase()) ||
					user.lastName.toLowerCase().includes(inputUserName?.toLowerCase()) ||
					user.email.toLowerCase().includes(inputUserName?.toLowerCase())
				);
			})
		);
	}, [inputUserName]);

	useEffect(() => {
		handleScrollEnd(groupUser.current);
	}, [isGroupUsers]);

	const addGroupUser = (user) => {
		const existUsers = isGroupUsers.find((currUser) => currUser?._id == user?._id);
		if (!existUsers) {
			setGroupUsers([...isGroupUsers, user]);
			setInputUserName("");
		} else {
			toast.warn(`${user?.firstName} is already added to the group`);
		}
	};

	const handleRemoveGroupUser = (removeUserId) => {
		setGroupUsers(isGroupUsers.filter((user) => user?._id !== removeUserId));
	};

	const handleCreateGroupChat = async () => {
		if (isGroupUsers.length < 2) {
			toast.warn("Please select at least 2 users for the group");
			return;
		} else if (!isGroupName.trim()) {
			toast.warn("Please enter a group name");
			return;
		}
		dispatch(setGroupChatBox());
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: isGroupName.trim(),
				users: isGroupUsers,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setGroupChatId(json?.data?._id));
				dispatch(setLoading(false));
				socket.emit("chat created", json?.data, authUserId);
				toast.success("Group created successfully!");
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="p-6 bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-600">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
								<MdGroupAdd className="text-white text-xl" />
							</div>
							<div>
								<h2 className="text-2xl font-bold text-white">Create Group</h2>
								<p className="text-sm text-gray-400">Add friends to start group chat</p>
							</div>
						</div>
						<button
							onClick={() => dispatch(setGroupChatBox())}
							className="p-2 hover:bg-slate-700 rounded-full transition-colors duration-200"
						>
							<MdOutlineClose className="text-gray-400 hover:text-white text-xl" />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
					{/* Search Users */}
					<div className="space-y-3">
						<label className="text-sm font-semibold text-gray-300">Search Users</label>
						<div className="relative">
							<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								value={inputUserName}
								type="text"
								placeholder="Search by name or email..."
								className="w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
								onChange={(e) => setInputUserName(e.target?.value)}
							/>
							{inputUserName && (
								<button
									onClick={() => setInputUserName("")}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
								>
									<HiX />
								</button>
							)}
						</div>
					</div>

					{/* Selected Users */}
					{isGroupUsers.length > 0 && (
						<div className="space-y-3">
							<label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
								<FaUsers className="text-purple-400" />
								Selected Members ({isGroupUsers.length})
							</label>
							<div
								ref={groupUser}
								className="flex flex-wrap gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-600 max-h-24 overflow-y-auto"
							>
								{isGroupUsers.map((user) => (
									<div
										key={user?._id}
										className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 py-1 px-3 rounded-full text-sm font-medium text-white group hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
									>
										<img
											src={user?.image}
											alt={user?.firstName}
											className="w-6 h-6 rounded-full border border-purple-400/50"
										/>
										<span>{user?.firstName}</span>
										<button
											onClick={() => handleRemoveGroupUser(user?._id)}
											className="ml-1 p-1 hover:bg-red-500/20 rounded-full transition-colors duration-200"
											title={`Remove ${user?.firstName}`}
										>
											<HiX className="text-xs text-red-400 hover:text-red-300" />
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Users List */}
					<div className="space-y-3">
						<label className="text-sm font-semibold text-gray-300">Available Users</label>
						<div className="bg-slate-800/30 rounded-xl border border-slate-600 max-h-64 overflow-y-auto">
							{selectedUsers.length == 0 && isChatLoading ? (
								<div className="p-4">
									<ChatShimmer />
								</div>
							) : (
								<div className="p-2 space-y-1">
									{selectedUsers?.length === 0 && !isChatLoading && (
										<div className="flex flex-col items-center justify-center py-8 text-center">
											<FaUsers className="text-3xl text-gray-500 mb-3" />
											<h3 className="font-semibold text-white mb-1">No users found</h3>
											<p className="text-sm text-gray-400">
												{inputUserName ? 'Try a different search term' : 'No users available'}
											</p>
										</div>
									)}
									{selectedUsers?.map((user, index) => {
										const isAlreadySelected = isGroupUsers.find(u => u._id === user._id);
										return (
											<div
												key={user?._id}
												className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
													isAlreadySelected 
														? 'bg-green-500/20 border border-green-400/30' 
														: 'hover:bg-slate-700/50 border border-transparent hover:border-slate-500/50'
												}`}
												onClick={() => !isAlreadySelected && addGroupUser(user)}
												style={{ animationDelay: `${index * 50}ms` }}
											>
												<div className="relative">
													<img
														className="h-10 w-10 rounded-full border-2 border-slate-600 object-cover"
														src={user?.image}
														alt="User avatar"
													/>
													{isAlreadySelected && (
														<div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
															<HiPlus className="text-xs text-white rotate-45" />
														</div>
													)}
												</div>
												<div className="flex-1">
													<h3 className="font-semibold text-gray-200 capitalize">
														{user?.firstName} {user?.lastName}
													</h3>
													<p className="text-xs text-gray-400">
														Joined {SimpleDateAndTime(user?.createdAt)}
													</p>
												</div>
												{!isAlreadySelected && (
													<HiPlus className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-6 bg-slate-800/50 border-t border-slate-600 space-y-4">
					{/* Group Name Input */}
					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-300">Group Name</label>
						<input
							type="text"
							placeholder="Enter group name..."
							value={isGroupName}
							onChange={(e) => setGroupName(e.target?.value)}
							className="w-full py-3 px-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 justify-end">
						<button
							onClick={() => dispatch(setGroupChatBox())}
							className="px-6 py-2 border border-slate-600 text-gray-300 rounded-xl hover:bg-slate-700 transition-colors duration-200"
						>
							Cancel
						</button>
						<button
							onClick={handleCreateGroupChat}
							disabled={isGroupUsers.length < 2 || !isGroupName.trim()}
							className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
						>
							Create Group
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupChatBox;