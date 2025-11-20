"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm(){
  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')

  const setFunctions: Record<string, (value: string) => void> = {
    username: setUsername,
    password: setPassword,
  };

  const router = useRouter();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFunctions[field](event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();

    
    const user = { username, password }

    try {
      const response = await fetch("http://localhost:8080/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      if(!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed: ", errorData);
        return;
      }

      const token = response.headers.get("Authorization");
      if(token) {
        localStorage.setItem("jwt", token);
        console.log("JWT stored: ", token);
        router.push("/dashboard");
      } else {
        console.warn("No token received in Authorization header")
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F5F3E7] rounded-lg p-5 w-2/5 h-auto">
      <h2 className="block font-bold text-center mb-2 rounded-t">Log-in to Inventrium</h2>
      <label className="form-label" htmlFor="username">Username</label>
      <input required type="text" name="username" value={username} onChange={(ev) => handleInput(ev, 'username')}/>
      <label className="form-label" htmlFor="password">Password</label>
      <input required type="password" name="password" value={password} onChange={(ev) => handleInput(ev, 'password')}/>
      <input className="block bg-[#E1A600] p-2 mt-5 font-bold cursor-pointer rounded m-auto" type="submit" value="Log-in" />
      <Link href="/signup" className="block text-center font-bold mt-2">Don't have an account?</Link>
    </form>
  );
}