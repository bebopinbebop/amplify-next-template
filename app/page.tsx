// Due to the nextJS update, there is no index.js nor app route, so we are figuring it out as we go in TS

"use client"; //This directive tells Next.js that this component should be rendered on the client side and can use React hooks and client-side features.
//By default, Next.js treats components as Server Components. They cannot use client-side features like useState and useEffect.




import {useState, useEffect} from 'react'
import {API} from '@aws-amplify/api' // this is THE api that you make in amplify api command
import { listPosts } from '@/src/graphql/queries';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { Post} from '@/src/API'; // Import the Post type from API.ts
import Link from 'next/link'

import '../configureAmplify'

// function MyApp({Component, pageProps}){
//   return (
//     <div>
//       <Navbar/>
//       <div className='py-8 px-16 bg-slate-100'>
//         <Component {...pageProps}/>
//       </div>
//     </div>
//   )
// }


// https://stackoverflow.com/questions/41219542/how-to-import-js-modules-into-typescript-file --> you have to include a * and a variable name for the import to work

export default function Home({Component, pageProps}) {

  const [posts, setPosts] = useState([]);// creates two variables, posts and setPosts, which uses the State to file them in

  useEffect(()=>{fetchPosts()},[])

  async function fetchPosts(){
    // const postData = await API.graphql({
    //   query:listPosts
    // }) 
    //   // setPosts(postData.data.listPosts.items) // this does not work because of TypeScripts unique ability where postData could be either am 'Observable' or 'GraphQLResult<any>' object, where the first one acts as a stream and is not garanteed to have a data field, but the second one does and is not a stream
    //   setPosts((postData as GraphQLResult<any>).data.listPosts.items);
    try {
      const postData = await API.graphql({ query: listPosts }) as GraphQLResult<any>;
      setPosts(postData.data.listPosts.items);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

  }



  return (
    <div>
      <h1 className='text-sky-400 text-6xl font-bold underline'>All Posts</h1>
  
      {posts.map((post) => (
        <Link 
          key={post.id} // Apply key to the Link component
          href={`/posts/${post.id}`} // Provide the href prop with the correct URL
          className='cursor-pointer border-gray-300 border-b mt-8 pb-4' // Add styling directly here
        >
          <div>
            <h2 className='text-xl font-semibold'>
              {post.title}
            </h2>
            <p className='text-gray-500 mt-2'>Author: {post.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
  
}
