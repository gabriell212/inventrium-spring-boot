"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginForm(){
  let [cui, setCui] = useState('')
  let [password, setPassword] = useState('')

  const setFunctions: Record<string, (value: string) => void> = {
    cui: setCui,
    password: setPassword,
  };

  const router = useRouter();

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFunctions[field](event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();

    
    const requestBody = { cui, authPassword: password }

    try {
      const token = localStorage.getItem("jwt");
      if(!token) {
        console.error("No JWT found, user must log in first");
        return;
      }

      const response = await fetch("http://localhost:8080/company/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if(!response.ok) {
        const errorData = await response.json();
        errorData.message.forEach((msg: string) => toast.error(msg));
        return;
      }

      const newToken = response.headers.get("Authorization");
      if(newToken) {
        localStorage.setItem("jwt", newToken.replace("Bearer ", ""));
        router.push("/dashboard");
      }

      const data = await response.json();
      console.log("Joined company:", data);
      

    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F5F3E7] rounded-lg p-5 w-2/5 h-auto">
      <h2 className="block font-bold text-center mb-2 rounded-t">Join Company</h2>
      <label className="form-label" htmlFor="cui">CUI</label>
      <input required type="text" name="cui" value={cui} onChange={(ev) => handleInput(ev, 'cui')}/>
      <label className="form-label" htmlFor="password">Password</label>
      <input required type="password" name="password" value={password} onChange={(ev) => handleInput(ev, 'password')}/>
      <input className="block bg-[#E1A600] p-2 mt-5 font-bold cursor-pointer rounded m-auto" type="submit" value="Join" />
    </form>
  );
}