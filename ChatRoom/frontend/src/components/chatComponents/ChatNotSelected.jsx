// Enhanced ChatNotSelected.jsx
import React from "react";
import { HiChatBubbleLeftRight, HiSparkles } from "react-icons/hi2";
import { BsChat, BsChatDots } from "react-icons/bs";

const ChatNotSelected = () => {
	return (
		<div className="h-full w-full flex flex-col justify-center items-center font-semibold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-20 left-10 animate-pulse">
					<BsChat className="text-6xl text-blue-400" />
				</div>
				<div className="absolute bottom-32 right-16 animate-pulse delay-1000">
					<BsChatDots className="text-4xl text-purple-400" />
				</div>
				<div className="absolute top-1/2 left-20 animate-pulse delay-500">
					<HiSparkles className="text-5xl text-pink-400" />
				</div>
			</div>

			{/* Main Content */}
			<div className="text-center z-10 max-w-md mx-auto px-6">
				{/* Animated Icon */}
				<div className="mb-8 relative">
					<div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
						<HiChatBubbleLeftRight className="text-4xl text-white" />
					</div>
					<div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 animate-ping"></div>
				</div>

				{/* Text Content */}
				<h1 className="text-2xl md:text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					Welcome to ChatApp
				</h1>
				<p className="text-lg text-gray-300 mb-6">
					Select a chat to start messaging
				</p>
				<p className="text-sm text-gray-400 leading-relaxed">
					Choose a conversation from the sidebar to begin chatting with your friends and colleagues.
				</p>

				{/* Decorative Elements */}
				<div className="mt-8 flex justify-center space-x-2">
					<div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
					<div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
					<div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></div>
				</div>
			</div>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
		</div>
	);
};

export default ChatNotSelected;