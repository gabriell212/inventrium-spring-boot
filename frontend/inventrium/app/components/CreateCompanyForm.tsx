"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm({ toggleLogin } : any){
  let [name, setName] = useState(''),
      [cui, setCui] = useState(''),
      [registrationNumber, setRegistrationNumber] = useState(''),
      [email, setEmail] = useState(''),
      [phone, setPhone] = useState(''),
      [address, setAddress] = useState(''),
      [authPassword, setAuthPassword] = useState(''),
      [authPasswordCheck, setAuthPasswordCheck] = useState('');

  const setFunctions: Record<string, (value: string) => void> = {
  name: setName,
  cui: setCui,
  registrationNumber: setRegistrationNumber,
  email: setEmail,
  phone: setPhone,
  address: setAddress,
  authPassword: setAuthPassword,
  authPasswordCheck: setAuthPasswordCheck
};

const router = useRouter();

const handleInput = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
  setFunctions[field](event.target.value);
  if (field === "authPasswordCheck") {
    if(authPassword !== event.target.value) {
      event.target.setCustomValidity("Parolele nu corespund!")
    } else {
      event.target.setCustomValidity("");
    }
  }
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();

    if (authPassword !== authPasswordCheck) {
      return;
    }
    
    const company = { name, cui, registrationNumber, email, phone, address, authPassword }

    try {
      const token = localStorage.getItem("jwt");
      if(!token) {
        console.error("No JWT found, user must log in first");
        return;
      }

      const response = await fetch("http://localhost:8080/company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(company)
      });

      if(!response.ok) {
        const errorData = await response.json();
        console.error("Failed: ", errorData);
        return;
      }

      const newToken = response.headers.get("Authorization");
      if(newToken) {
        localStorage.setItem("jwt", newToken.replace("Bearer ", ""));
        router.push("/dashboard");
      }

      const data = await response.json();
      console.log("Company created:", data);

    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#F5F3E7] rounded-lg p-5 w-2/5 h-auto">
      <h2 className="block font-bold text-center mb-2 rounded-t">Create a company</h2>
      <label className="form-label" htmlFor="name">Company Name</label>
      <input required type="text" name="name" onChange={(ev) => handleInput(ev, 'name')} value={name} />
      
      <label className="form-label" htmlFor="cui">CUI</label>
      <input required type="text" name="cui" onChange={(ev) => handleInput(ev, 'cui')} value={cui} />
      
      <label className="form-label" htmlFor="registrationNumber">Registration Number</label>
      <input required type="text" name="registrationNumber" onChange={(ev) => handleInput(ev, 'registrationNumber')} value={registrationNumber} />
      
      <label className="form-label" htmlFor="email">Email</label>
      <input required type="email" name="email" onChange={(ev) => handleInput(ev, 'email')} value={email} />
      
      <label className="form-label" htmlFor="phone">Phone</label>
      <input required type="tel" name="phone" onChange={(ev) => handleInput(ev, 'phone')} value={phone} />

      <label className="form-label" htmlFor="address">Address</label>
      <input required type="text" name="address" onChange={(ev) => handleInput(ev, 'address')} value={address} />

      <label className="form-label" htmlFor="password">Password</label>
      <input required type="password" name="password" onChange={(ev) => handleInput(ev, 'authPassword')} value={authPassword} />
      
      <label className="form-label" htmlFor="passwordCheck">Confirm Password</label>
      <input required type="password" name="passwordCheck" onChange={(ev) => handleInput(ev, 'authPasswordCheck')} value={authPasswordCheck} />
      <input className="block bg-[#E1A600] p-2 mt-5 font-bold cursor-pointer rounded m-auto" type="submit" value="Create company" />
    </form>
  );
}