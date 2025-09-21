// Enhanced UserSearch.jsx
import React, { useEffect, useState } from "react";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import { HiUsers, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
	setChatLoading,
	setLoading,
	setUserSearchBox,
} from "../../redux/slices/conditionSlice";
import { toast } from "react-toastify";
import ChatShimmer from "../loading/ChatShimmer";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const UserSearch = () => {
	const dispatch = useDispatch();
	const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [inputUserName, setInputUserName] = useState("");
	const authUserId = useSelector((store) => store?.auth?._id);

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

	const handleCreateChat = async (userId) => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				userId: userId,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				dispatch(setLoading(false));
				socket.emit("chat created", json?.data, authUserId);
				toast.success("Chat created successfully!");
				dispatch(setUserSearchBox());
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.message);
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="flex flex-col h-full bg-gradient-to-b from-slate-800 to-slate-900">
			{/* Header */}
			<div className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 border-r border-slate-600 shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-xl font-bold text-white flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
							<FaUserPlus className="text-sm text-white" />
						</div>
						New Chat
					</h1>
					<button
						onClick={() => dispatch(setUserSearchBox())}
						className="p-2 hover:bg-slate-700 rounded-full transition-colors duration-200"
					>
						<HiX className="text-gray-400 hover:text-white" />
					</button>
				</div>

				{/* Enhanced Search Bar */}
				<div className="relative">
					<FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search users by name or email..."
						value={inputUserName}
						onChange={(e) => setInputUserName(e.target.value)}
						className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
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

				{/* Search Results Counter */}
				{inputUserName && (
					<div className="mt-2 text-sm text-gray-400">
						{selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} found
					</div>
				)}
			</div>

			{/* Users List */}
			<div className="flex-1 overflow-y-auto p-2 space-y-1">
				{selectedUsers.length == 0 && isChatLoading ? (
					<ChatShimmer />
				) : (
					<>
						{selectedUsers?.length === 0 && !isChatLoading && (
							<div className="flex flex-col items-center justify-center h-full text-center p-8">
								<div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
									<HiUsers className="text-2xl text-slate-400" />
								</div>
								<h3 className="text-lg font-semibold text-white mb-2">
									{inputUserName ? 'No users found' : 'No users available'}
								</h3>
								<p className="text-gray-400 text-sm">
									{inputUserName 
										? 'Try searching with a different name or email' 
										: 'No registered users to display'
									}
								</p>
							</div>
						)}
						{selectedUsers?.map((user, index) => {
							return (
								<div
									key={user?._id}
									className="w-full p-3 border border-slate-600/50 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-lg"
									onClick={() => handleCreateChat(user._id)}
									style={{
										animationDelay: `${index * 50}ms`
									}}
								>
									<div className="flex items-center gap-3">
										{/* Enhanced Avatar */}
										<div className="relative">
											<img
												className="h-12 w-12 rounded-full border-2 border-slate-600 group-hover:border-green-400 object-cover transition-all duration-300"
												src={user?.image}
												alt="User avatar"
											/>
											{/* Online Status */}
											<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-800 rounded-full"></div>
										</div>

										{/* User Info */}
										<div className="flex-1 min-w-0">
											<div className="flex justify-between items-start">
												<h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors duration-200 capitalize truncate">
													{user?.firstName} {user?.lastName}
												</h3>
												<FaUserPlus className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2" />
											</div>
											<p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200 truncate">
												{user?.email}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												Joined {SimpleDateAndTime(user?.createdAt)}
											</p>
										</div>
									</div>

									{/* Hover Effect Overlay */}
									<div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
								</div>
							);
						})}
					</>
				)}
			</div>
		</div>
	);
};

export default UserSearch;