"use client"; 

import Link from "next/link"
import React, {useState, useEffect} from "react"
import '../configureAmplify'
import {Auth} from '@aws-amplify/auth'
import { Hub } from '@aws-amplify/core'

import '../configureAmplify'

const NavBar = () => {
    const [signedUser, setSignedUser] = useState(false)
    useEffect(()=>{authListener()})


    async function authListener(){
        Hub.listen("auth", (data)=>{
            switch(data.payload.event){
                case "signIn":
                    return setSignedUser(true)
                case "signOut":
                    return setSignedUser (false)
            }
        })
        try{
            await Auth.currentAuthenticatedUser();
            setSignedUser(true);
        }catch(err){

        }
    }

    return(
        <nav className="flex justify-center pt-3 pb-3 space-x-4 border-b bg-cuan-500 border-gray-300">
            {
                [
                    ["Home", "/"],
                    ["Create Post", "/create-post"],
                    ["Profile", "/profile"]
                ].map(([title, url], index) => (
                    <Link href={url} key={index} className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slage-100 hover:text-slate-900">
                     
                            {" "}
                            {title}
                    </Link>
                ))
            }
            {
                signedUser && (
                    <Link href='/my-posts' className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slage-100 hover:text-slate-900">
                        My Posts
                    </Link>
                )
            }
        </nav>
    )
}

export default NavBar