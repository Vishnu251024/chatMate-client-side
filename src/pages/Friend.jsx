import React, { useEffect, useState } from "react";
import { FaSearch, FaUserFriends, FaUserPlus, FaClock } from "react-icons/fa";
import authService from "../services/authService.js";
import friendService from "../services/friendService.js";
import { toast } from "react-hot-toast"; // Import toast
import { useSelector } from "react-redux";

const Friend = () => {
    const users=useSelector(state=>state.user.allUsers)
    const friendRequests=useSelector(state=>state.user.friendRequests);
    const [searchTerm, setSearchTerm] = useState("");
    const [sentRequests, setSentRequests] = useState([]);

    const sendFriendRequest = (userId) => {
        friendService
            .sendFriendRequest(userId)
            .then((response) => {
                setSentRequests((prev) => [...prev, userId]);
                toast.success("Friend request sent!");
            })
            .catch((error) => {
                console.error("Error sending friend request:", error);
                toast.error("Error sending friend request!");
            });
    };

    const handleAcceptRequest = (requestId) => {
        friendService
            .acceptFriendRequest(requestId)
            .then(() => {
                toast.success("Friend request accepted!");
                setFriendRequests((prev) =>
                    prev.filter((request) => request._id !== requestId)
                );
            })
            .catch((error) => {
                console.error("Error accepting friend request:", error);
                toast.error("Error accepting friend request!");
            });
    };

    const handleDeclineRequest = (requestId) => {
        friendService
            .declineFriendRequest(requestId)
            .then(() => {
                toast.success("Friend request declined!");
                setFriendRequests((prev) =>
                    prev.filter((request) => request._id !== requestId)
                );
            })
            .catch((error) => {
                console.error("Error declining friend request:", error);
                toast.error("Error declining friend request!");
            });
    };

    const displayedUsers = users.filter((user) =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="friends-page h-lvh w-full px-4 pt-20 ">
                <h1 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaUserFriends /> Friends Page</h1>
                <div className="flex items-center mb-6 flex-wrap gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-md px-4 py-2 sm:w-64 outline-none w-5/6"
                    />
                    <button className="bg-blue-500 px-2 py-2 rounded-md flex items-center gap-2 h-10">
                        <FaSearch />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="users-list mb-8 flex-1">
                        <h2 className="text-xl font-semibold mb-2">All Users</h2>
                        {displayedUsers.length > 0 ? (
                            displayedUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between border-b border-gray-200 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar || "https://via.placeholder.com/40"}
                                            alt={user.fullName || "User Avatar"}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <span>{user.userName}</span>
                                    </div>
                                    <button
                                        className={`${sentRequests.includes(user._id)
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                            } px-3 py-2 rounded-md flex items-center gap-2`}
                                        onClick={() => sendFriendRequest(user._id)}
                                        disabled={sentRequests.includes(user._id)}
                                    >
                                        <span className="block sm:hidden">
                                            {sentRequests.includes(user._id) ? (
                                                <FaClock className="animate-spin" />
                                            ) : (
                                                <FaUserPlus />
                                            )}
                                        </span>
                                        <span className="hidden sm:inline">
                                            {sentRequests.includes(user._id) ? "Pending" : "Add Friend"}
                                        </span>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No users found.</p>
                        )}
                    </div>

                    <div className="friend-requests flex-1">
                        <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
                        {friendRequests.length > 0 ? (
                            friendRequests.map((request) => (
                                <div
                                    key={request._id}
                                    className="flex items-center justify-between border-b border-gray-200 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={request.avatar || "https://via.placeholder.com/40"}
                                            alt={request.fullName || "Sender Avatar"}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <span>{request.userName}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {request.status === "pending" && (
                                            <FaClock className="text-yellow-500" />
                                        )}
                                        <button
                                            className="bg-blue-500 px-3 py-2 rounded-md"
                                            onClick={() => handleAcceptRequest(request._id)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="bg-red-500 px-3 py-2 rounded-md"
                                            onClick={() => handleDeclineRequest(request._id)}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No Upcoming requests.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Friend;
