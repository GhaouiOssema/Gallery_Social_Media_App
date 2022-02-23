import React, { useState, useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const PinDetails = ({ user }) => {
	const [pins, setPins] = useState(null);
	const [pinDetail, setPinDetail] = useState(null);
	const [comment, setComment] = useState('');
	const [addingComment, setAddingComment] = useState(false);
	const { pinId } = useParams();

	const addComment = () => {
		if (comment) {
			setAddingComment(true);
			// adding comments the date base
			client
				.patch(pinId)
				.setIfMissing({ comments: [] })
				.insert('after', 'comments[-1]', [
					{
						comment,
						_key: uuidv4(),
						postedBy: {
							_type: 'postedBy',
							_ref: user._id,
						},
					},
				])
				.commit()
				.then(() => {
					fetchPinDetails();
					setComment('');
					setAddingComment(false);
				});
		}
	};

	const fetchPinDetails = () => {
		let query = pinDetailQuery(pinId);
		if (query) {
			client.fetch(query).then((data) => {
				setPinDetail(data[0]);
				if (data[0]) {
					query = pinDetailMorePinQuery(data[0]);
					client.fetch(query).then((res) => {
						setPins(res);
					});
				}
			});
		}
	};
	useEffect(() => {
		fetchPinDetails();
	}, [pinId]);

	if (!pinDetail) return <Spinner msg='Loading pin...' />;

	return (
		<>
			<div
				className='flex xl:flex-col flex-col m-auto bg-white'
				style={{ maxWidth: '950px', borderRadius: 32 }}>
				<div className='flex justify-center items-center md:items-start flex-initial'>
					<img
						src={pinDetail?.image && urlFor(pinDetail.image).url()}
						alt='user-post'
						className='rounded-t-3xl rounded-b-lg'
					/>
				</div>
				<div className='w-full p-5 flex-1 xl:min-w-620'>
					<h2 className='text-black text-2xl font-bold flex justify-center items-center p-3'>
						Destination :
					</h2>
					<div className='flex items-center justify-between bg-Fuchsia p-3 rounded-2xl'>
						<div className='flex gap-2 items-center'>
							<a
								href={`${pinDetail?.image?.asset?.url}?dl=`}
								download
								onClick={(e) => {
									e.stopPropagation();
								}}
								className='bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'>
								<MdDownloadForOffline color='black' />
							</a>
						</div>
						<a
							href={pinDetail.destination}
							target='_blank'
							className='text-black font-bold border-gray-100 outline-none border-2 p-2 rounded-2xl'
							rel='noreferre'>
							{pinDetail.destination.length > 20
								? pinDetail.destination.slice(8, 65)
								: pinDetail.destination.slice(8)}
						</a>
					</div>
					<div>
						<h1 className='text-4xl font-bold break-words mt-3'>
							{pinDetail.title}
						</h1>
						<p className='mt-3'>{pinDetail.about}</p>
					</div>
					<Link
						to={`/user-profile/${pinDetail.postedBy?._id}`}
						className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
						<img
							className='w-8 h-8 rounded-full object-cover'
							src={pinDetail.postedBy?.image}
							alt='user-profile'
						/>
						<p className='font-semibold capitalize'>
							{pinDetail.postedBy?.userName}
						</p>
					</Link>
					<h2 className='mt-5 text-2xl font-bold'>Comments :</h2>
					<div className='max-h-370 overflow-y-auto'>
						{pinDetail?.comments?.map((comment, i) => (
							<div
								className='flex gap-2 mt-5 items-center bg-white rounded-lg'
								key={i}>
								<img
									src={comment?.postedBy?.image}
									alt='user-profile'
									className='w-10 h-10 rounded-full cursor-pointer'
								/>
								<div className='flex flex-col'>
									<p className='font-bold'>
										{comment.postedBy.userName}
									</p>
									<p>{comment.comment}</p>
								</div>
							</div>
						))}
					</div>
					<div className='flex flex-wrap mt-6 gap-3 items-center'>
						<Link to={`/user-profile/${pinDetail.postedBy?._id}`}>
							<img
								className='w-10 h-10 rounded-full object-cover'
								src={pinDetail.postedBy?.image}
								alt='user-profile'
							/>
						</Link>
						<input
							className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
							type='text'
							placeholder='Add your Comments here...'
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<button
							type='submit'
							className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
							onClick={addComment}>
							{addingComment ? 'Posting the Comment...' : 'Post'}
						</button>
					</div>
				</div>
			</div>
			{pins?.length > 0 ? (
				<>
					<h2 className='text-center font-bold text-2xl mt-8 mb-4'>
						More Like this
					</h2>
					<MasonryLayout pins={pins} />
				</>
			) : (
				<Spinner msg='Loading more pins...' />
			)}
		</>
	);
};

export default PinDetails;
