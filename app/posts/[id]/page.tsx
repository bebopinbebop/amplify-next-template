// app/posts/[id]/page.tsx

import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api'; 
import ReactMarkdown from 'react-markdown'; // Correct import for react-markdown
import { listPosts, getPost } from '../../../src/graphql/queries';
import '../../../configureAmplify';

// // Define the PostProps interface for typing
// interface PostProps {
//     post: {
//         id: string;
//         title: string;
//         content: string;
//     };
// }

// Fetch data directly in the component
async function fetchPost(id: string) {
    const postData = await API.graphql({
        query: getPost,
        variables: { id }
    }) as GraphQLResult<{ getPost: any }>;

    return postData.data.getPost;
}

// Define the page component
export default async function Post({ params }: { params: { id: string } }) {
    const post = await fetchPost(params.id);

    return (
        <div>
            <h1 className='text-5xl mt-4 font-semibold tracking-wide'>{post.title}</h1>
            <p className='text-sm font-light my-4'>By {post.username}</p>
            <ReactMarkdown>{post.content}</ReactMarkdown> {/* Assuming post.content is Markdown */}
        </div>
    );
}

