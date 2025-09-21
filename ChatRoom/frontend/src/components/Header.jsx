import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import handleScrollTop from "../utils/handleScrollTop";
import {
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdNotificationsActive,
	MdSearch,
} from "react-icons/md";
import {
	setHeaderMenu,
	setLoading,
	setNotificationBox,
	setProfileDetail,
} from "../redux/slices/conditionSlice";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi";
import Lottie from "lottie-react";
import DancingAnimation from "../assets/dancing.json";

const Header = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const user = useSelector((store) => store.auth);
	const isHeaderMenu = useSelector((store) => store?.condition?.isHeaderMenu);
	const newMessageRecieved = useSelector(
		(store) => store?.myChat?.newMessageRecieved
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const getAuthUser = (token) => {
		dispatch(setLoading(true));
		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addAuth(json.data));
				dispatch(setLoading(false));
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
			});
	};

	useEffect(() => {
		if (token) {
			getAuthUser(token);
			navigate("/");
		}
		dispatch(setHeaderMenu(false));
	}, [token]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		navigate("/signin");
	};

	useEffect(() => {
		let prevScrollPos = window.pageYOffset;
		const handleScroll = () => {
			const currentScrollPos = window.pageYOffset;
			setIsScrolled(currentScrollPos > 20);
			
			if (prevScrollPos < currentScrollPos && currentScrollPos > 80) {
				document.getElementById("header").classList.add("hiddenbox");
			} else {
				document.getElementById("header").classList.remove("hiddenbox");
			}
			prevScrollPos = currentScrollPos;
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	const headerMenuBox = useRef(null);
	const headerUserBox = useRef(null);
	const handleClickOutside = (event) => {
		if (
			headerMenuBox.current &&
			!headerUserBox?.current?.contains(event.target) &&
			!headerMenuBox.current.contains(event.target)
		) {
			dispatch(setHeaderMenu(false));
		}
	};

	useEffect(() => {
		if (isHeaderMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isHeaderMenu]);

	return (
		<>
			<style jsx>{`
				.hiddenbox {
					transform: translateY(-100%);
				}
				.header-transition {
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}
				.glass-effect {
					backdrop-filter: blur(20px);
					-webkit-backdrop-filter: blur(20px);
				}
				.notification-pulse {
					animation: pulse-glow 2s infinite;
				}
				@keyframes pulse-glow {
					0%, 100% {
						box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
					}
					50% {
						box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4);
					}
				}
				.slide-down {
					animation: slideDown 0.3s ease-out forwards;
				}
				@keyframes slideDown {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.hover-lift {
					transition: transform 0.2s ease;
				}
				.hover-lift:hover {
					transform: translateY(-2px);
				}
			`}</style>
			
			<div
				id="header"
				className={`w-full h-16 md:h-20 fixed top-0 z-50 header-transition ${
					isScrolled 
						? 'glass-effect bg-slate-900/90 shadow-2xl shadow-slate-900/50' 
						: 'bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900'
				} backdrop-blur-sm flex justify-between items-center px-4 md:px-8 font-semibold text-white`}
			>
				{/* Logo and Brand */}
				<div className="flex items-center justify-start gap-3 hover-lift">
					<Link to={"/"} className="flex items-center gap-3">
						<div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-600 p-1">
							<div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
								<Lottie 
									animationData={DancingAnimation} 
									loop={true} 
									className="w-8 h-8" 
								/>
							</div>
						</div>
						<div className="hidden sm:flex flex-col">
							<span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
								ChatApp
							</span>
							<span className="text-xs text-gray-400 -mt-1">Connect & Chat</span>
						</div>
					</Link>
				</div>

				{/* Search Bar - Hidden on mobile */}
				<div className="hidden md:flex flex-1 max-w-md mx-8">
					<div className={`relative w-full transition-all duration-300 ${
						searchFocused ? 'scale-105' : ''
					}`}>
						<MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search conversations..."
							className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
							onFocus={() => setSearchFocused(true)}
							onBlur={() => setSearchFocused(false)}
						/>
					</div>
				</div>

				{/* Navigation and User Area */}
				<div className="flex flex-nowrap items-center gap-4">
					{/* Forum Link */}
					<Link 
						to={"/forum"} 
						className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover-lift"
					>
						<HiSparkles className="text-yellow-400" />
						<span className="text-sm">Forum</span>
					</Link>

					{user ? (
						<>
							{/* Notifications */}
							<div
								className={`relative cursor-pointer p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 transition-all duration-300 hover-lift ${
									newMessageRecieved.length > 0
										? "notification-pulse border-blue-400"
										: ""
								}`}
								title={`You have ${newMessageRecieved.length} new notifications`}
								onClick={() => dispatch(setNotificationBox(true))}
							>
								<MdNotificationsActive 
									className={`text-xl ${
										newMessageRecieved.length > 0 ? 'text-blue-400' : 'text-gray-400'
									}`}
								/>
								{newMessageRecieved.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
										{newMessageRecieved.length > 9 ? '9+' : newMessageRecieved.length}
									</span>
								)}
							</div>

							{/* Welcome Message - Hidden on mobile */}
							<span className="hidden lg:block text-sm text-gray-300">
								Hi, <span className="text-blue-400 font-semibold">{user.firstName}</span>
							</span>

							{/* User Menu */}
							<div className="relative">
								<div
									ref={headerUserBox}
									onClick={(e) => {
										e.preventDefault();
										dispatch(setHeaderMenu(!isHeaderMenu));
									}}
									className="flex items-center gap-2 p-1 pr-3 rounded-full bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-600 hover:border-slate-500 cursor-pointer transition-all duration-300 hover-lift hover:shadow-lg hover:shadow-blue-500/20"
								>
									<div className="relative">
										<img
											src={user.image}
											alt="Profile"
											className="w-10 h-10 rounded-full border-2 border-slate-600 object-cover"
										/>
										<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-slate-800 rounded-full"></div>
									</div>
									<span className="hidden sm:block text-sm">
										{isHeaderMenu ? (
											<MdKeyboardArrowUp className="text-gray-400" />
										) : (
											<MdKeyboardArrowDown className="text-gray-400" />
										)}
									</span>
								</div>

								{/* Dropdown Menu */}
								{isHeaderMenu && (
									<div
										ref={headerMenuBox}
										className="absolute top-14 right-0 w-48 bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden slide-down"
									>
										<div className="p-2">
											<div
												onClick={() => {
													dispatch(setHeaderMenu(false));
													dispatch(setProfileDetail());
												}}
												className="flex items-center gap-3 w-full p-3 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-all duration-200 group"
											>
												<PiUserCircleLight className="text-xl text-blue-400 group-hover:text-blue-300" />
												<span className="text-sm group-hover:text-white">Profile</span>
											</div>
											<div
												className="flex items-center gap-3 w-full p-3 rounded-xl cursor-pointer hover:bg-red-500/20 transition-all duration-200 group"
												onClick={handleLogout}
											>
												<IoLogOutOutline className="text-xl text-red-400 group-hover:text-red-300" />
												<span className="text-sm group-hover:text-white">Logout</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<Link to={"/signin"}>
							<button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift hover:scale-105">
								Sign In
							</button>
						</Link>
					)}
				</div>
			</div>
		</>
	);
};

export default Header;