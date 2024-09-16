"use client";

import { useEffect, useState } from "react";
import { Auth, API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api'; 
import { postsByUsername } from "@/src/graphql/queries";
import Link from "next/link";


export default function MyPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const {username} = await Auth.currentAuthenticatedUser();

            const postData = await API.graphql({
                query: postsByUsername,
                variables: { username }
            }) as GraphQLResult<any>;

            setPosts(postData.data.postsByUsername.items);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    return (
        <div>
            <h1 className='text-3xl font-semibold tracking-wide mt-6 mb-2'>My Posts</h1>
            {
                posts.map((post) => (
                    <Link   href={`/posts/${post.id}`}
                            key={post.id}
                            className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
                        
                            <h2 className='text-xl font-semibold'>
                                {post.title}
                            </h2>
                            <p className="text-gray-500 mt-2">Author: {post.username}</p>
                        
                    </Link>
                ))
            }
        </div>
    );
}
