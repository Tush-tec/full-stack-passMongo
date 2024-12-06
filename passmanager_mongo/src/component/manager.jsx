import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", userName: "", passWord: "" });
  const [passWordArray, setPasswordArray] = useState([]);

  const getPassword = async () => {
    try {
      const req = await fetch("http://localhost:8080/");
      const passWord = await req.json();
      if (passWord) {
        setPasswordArray(passWord); // Set the fetched password array
      }
    } catch (error) {
      console.error("Error fetching passwords:", error);
    }
  };

  // Fetch passwords when component mounts
  useEffect(() => {
    getPassword();
  }, []);

  // Save password
  const savePassword = async () => {
    if (form.site.length > 3 && form.userName.length > 3 && form.passWord.length > 3) {
      await fetch("http://localhost:8080/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...form, id: uuidv4() }),
      });
      setPasswordArray([...passWordArray, { ...form, id: uuidv4() }]);
      setForm({ site: "", userName: "", passWord: "" });
    }
  };

  const deletePassword = async (id) => {
    const confirmDelete = window.confirm("Do you really want to delete your password?");
    if (confirmDelete) {
      setPasswordArray(passWordArray.filter((item) => item.id !== id));
      await fetch("http://localhost:8080/", {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
    }
  };

  const editPassword = (id) => {
    const passwordToEdit = passWordArray.find((item) => item.id === id);
    if (passwordToEdit) {
      setForm(passwordToEdit);
      setPasswordArray(passWordArray.filter((item) => item.id !== id));
    } else {
      console.log("No matching password found to edit");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showPassword = () => {
    const inputField = passwordRef.current;
    inputField.type = inputField.type === "password" ? "text" : "password";
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  };

  return (
    <>
      <div className="absolute top-0 -z-10 h-full w-full bg-green-50">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-green-100 opacity-50 blur-[80px]"></div>
      </div>
      <div className="mycontainer mx-auto px-4 py-5 max-w-screen-md">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-5700">&lt;</span>
          Pass
          <span className="text-green-600">OP /&gt;</span>
        </h1>
        <p className="text-green-700 text-center font-bold">
          Your Own Pass Manager
        </p>
        <div className="text-white flex flex-col p-4 text-black">
          <input
            className="rounded-full border border-green-500 text-black w-full px-4 py-1 mb-4"
            type="text"
            name="site"
            placeholder="Enter Website URL"
            value={form.site}
            onChange={handleChange}
          />
          <div className="flex justify-between mb-4 gap-5 w-full">
            <input
              className="rounded-full border text-black border-green-400 w-full px-4 py-1"
              placeholder="Enter Username"
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
            />
            <div className="relative w-full">
              <input
                className="rounded-full border text-black border-green-400 w-full px-4 py-1"
                placeholder="Enter Password"
                type="password"
                name="passWord"
                value={form.passWord}
                ref={passwordRef}
                onChange={handleChange}
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={showPassword}
              >
                <lord-icon
                  src="https://cdn.lordicon.com/dicvhxpz.json"
                  trigger="hover"
                  stroke="bold"
                  colors="primary:#242424,secondary:#0a5c15"
                ></lord-icon>
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center bg-slate-500 text-white font-2xl rounded-full px-4 py-2 mx-auto mb-4 hover:bg-green-400"
          >
            <lord-icon
              src="https://cdn.lordicon.com/fqbvgezn.json"
              trigger="hover"
              stroke="bold"
              colors="primary:#242424,secondary:#86c716"
            ></lord-icon>
            Add Details 
          </button>
        </div>

        <div className="password">
          <h2 className="font-bold text-2xl py-4 text-center">Your Password</h2>
          {passWordArray.length === 0 && <div className="text-center">There are no passwords to show.</div>}
          {passWordArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2 w-1/3">Site</th>
                  <th className="py-2 w-1/3">Username</th>
                  <th className="py-2 w-1/3">Password</th>
                  <th className="py-2 w-1/6">Action</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passWordArray.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-2 border border-white text-center w-1/3" onClick={() => copyText(item.site)}>
                      <a href={item.site} target="_blank" rel="noopener noreferrer">{item.site}</a>
                    </td>
                    <td className="px-2 py-2 border border-white text-center w-1/3" onClick={() => copyText(item.userName)}>
                      {item.userName}
                    </td>
                    <td className="px-10 py-2 border border-white text-center w-1/3" onClick={() => copyText(item.passWord)}>
                      {"*".repeat(item.passWord.length)}
                    </td>
                    <td className="py-5 flex justify-center border border-white text-center w-1/6">
                      <span className="cursor-pointer mx-1" onClick={() => deletePassword(item.id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/hwjcdycb.json"
                          trigger="hover"
                        ></lord-icon>
                      </span>
                      <span className="cursor-pointer mx-1" onClick={() => editPassword(item.id)}>
                        <lord-icon
                          src="https://cdn.lordicon.com/fikcyfpp.json"
                          trigger="hover"
                        ></lord-icon>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
