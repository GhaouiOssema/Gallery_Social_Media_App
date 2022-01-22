import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { BiLogOutCircle } from 'react-icons/bi';

import logo from '../assets/logo.png';
import { categories } from '../utils/data';

const isNotActiveStyle =
	'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';

const isActiveStyle =
	'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';
const logOutStyle =
	'flex flex-row items-center font-bold mt-2 px-3 text-base text-base cursor-pointer hover:text-red-700';
// const categories = [
// 	{
// 		name: 'Animals',
// 	},
// 	{
// 		name: 'Wallpapers',
// 	},
// 	{
// 		name: 'Photography',
// 	},
// 	{
// 		name: 'Gaming',
// 	},
// 	{
// 		name: 'Coding',
// 	},
// 	{
// 		name: 'Other',
// 	},
// ];

const SideBar = ({ user, closeToggle }) => {
	const navigate = useNavigate();

	const handleCloseSideBar = () => {
		if (closeToggle) closeToggle(false);
	};

	return (
		<div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
			<div className='flex flex-col'>
				<Link
					to='/'
					className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
					onClick={handleCloseSideBar}>
					<img src={logo} alt='logo' className='w-full' />
				</Link>
				<div className='flex flex-col gap-5'>
					<NavLink
						to='/'
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSideBar}>
						<RiHomeFill />
						Home
					</NavLink>
					<h3 className='font-bold mt-2 px-5 text-base 2xl:text-xl'>
						Discover Categories
					</h3>
					{categories
						.slice(0, categories.length - 1)
						.map((category) => (
							<NavLink
								to={`/category/${category.name}`}
								className={({ isActive }) =>
									isActive ? isActiveStyle : isNotActiveStyle
								}
								onClick={handleCloseSideBar}
								key={category.name}>
								{category.name}
							</NavLink>
						))}
					<div
						className={logOutStyle}
						onClick={() => {
							localStorage.clear();
							navigate('/login', { replace: true });
						}}>
						<BiLogOutCircle fontSize={20} className='mr-2' />
						Log Out
					</div>
				</div>
			</div>
			{user && (
				<Link
					to={`user-profile/${user._id}`}
					className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
					onClick={handleCloseSideBar}>
					<img
						src={user.image}
						alt='user_picture'
						className='w-10 h-10 rounded-full'
					/>
					<p className='font-bold text-base'>{user.userName}</p>
				</Link>
			)}
		</div>
	);
};

export default SideBar;
