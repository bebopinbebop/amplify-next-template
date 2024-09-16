"use client";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState } from "react"; // No need to import useRef in this case
import {API} from 'aws-amplify'
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid"; // Correct import statement for uuid
import { createPost } from "../../src/graphql/mutations";
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"

const initialState = { title: "", content: "" };

function CreatePost() {
    const [post, setPost] = useState(initialState);
    const { title, content } = post;
    const router = useRouter();

    function onChange(e) {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value
        }));
    }

    async function createNewPost() {
        if (!title || !content) {
            alert('Title and content are required!');
            return; // Exit the function early if validation fails
        }
        const id = uuid();
        const newPost = { ...post, id }; // Spread the post and add the id

        await API.graphql({
            query: createPost,
            variables: { input: newPost },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        });

        router.push(`/posts/${id}`);
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Create New Post</h1>
            <input
                type="text"
                name="title"
                value={post.title}
                onChange={onChange}
                placeholder="Title"
                className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
            />

            <SimpleMDE
            value={post.content}
            onChange={(value)=> setPost({
                ...post,
                content: value
            })}
            />
            <button type="button"
            className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
            onClick={createNewPost}>Create Post</button>
        </div>
    );
}

export default withAuthenticator(CreatePost);
