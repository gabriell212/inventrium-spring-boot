"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm({ toggleLogin } : any){
  let [firstName, setFirstName] = useState(''),
      [lastName, setLastName] = useState(''),
      [username, setUsername] = useState(''),
      [email, setEmail] = useState(''),
      [password, setPassword] = useState(''),
      [passwordCheck, setPasswordCheck] = useState('');

  const setFunctions: Record<string, (value: string) => void> = {
  firstName: setFirstName,
  lastName: setLastName,
  username: setUsername,
  email: setEmail,
  password: setPassword,
  passwordCheck: setPasswordCheck
};

const router = useRouter();

const handleInput = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
  setFunctions[field](event.target.value);
  if (field === "passwordCheck") {
    if(password !== event.target.value) {
      event.target.setCustomValidity("Parolele nu corespund!")
    } else {
      event.target.setCustomValidity("");
    }
  }
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();

    if (password !== passwordCheck) {
      return;
    }
    
    const user = { firstName, lastName, username, email, password }

    try {
      const response = await fetch("http://localhost:8080/user/register", {
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
      } else {
        const data = await response.json();
        console.log("User registered:", data);
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F5F3E7] rounded-lg p-5 w-2/5 h-auto">
      <h2 className="block font-bold text-center mb-2 rounded-t">Sign-up to Inventrium</h2>
      <label className="form-label" htmlFor="firstName">First Name</label>
      <input required type="text" name="firstName" onChange={(ev) => handleInput(ev, 'firstName')} />
      <label className="form-label" htmlFor="lastName">Last Name</label>
      <input required type="text" name="lastName" onChange={(ev) => handleInput(ev, 'lastName')} />
      <label className="form-label" htmlFor="username">Username</label>
      <input required type="text" name="username" onChange={(ev) => handleInput(ev, 'username')} />
      <label className="form-label" htmlFor="email">Email</label>
      <input required type="email" name="email" onChange={(ev) => handleInput(ev, 'email')} />
      <label className="form-label" htmlFor="password">Password</label>
      <input required type="password" name="password" onChange={(ev) => handleInput(ev, 'password')} />
      <label className="form-label" htmlFor="password">Confirm Password</label>
      <input required type="password" name="passwordCheck" onChange={(ev) => handleInput(ev, 'passwordCheck')} />
      <input className="block bg-[#E1A600] p-2 mt-5 font-bold cursor-pointer rounded m-auto" type="submit" value="Create account" />
      <Link href="/login" className="block text-center font-bold mt-2 cursor-pointer w-full" onClick={toggleLogin}>Already have an account?</Link>
    </form>
  );
}