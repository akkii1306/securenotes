import { useState } from "react";
import { encryptNote } from "../utils/crypto"; 
import { toast } from "react-toastify";
const Editor =({onSave})=>{
    const [text, setText]=useState("");
    const [password, setPassword]=useState("");
    const handleSave=()=>{
        if(!text || !password)return toast.error("Fill all feilds");
        const encrypted =encryptNote(text, password);
        onSave(encrypted);
        setText("");
        toast.success("Note saved securely!");
    };
    return(
        <div className="p-4 space-y-4 ">
            <textarea className="w-full h-48 p-2 border" value={text} onChange={(e)=> setText(e.target.value)}/>
                <input className="border p-2 w-full" type="password" placeholder="Encryption Password" value={password} onChange={(e)=>
                    setPassword(e.target.value)
                }/>
                <button onClick={handleSave} className="bg-purple-700 text-white px-4 py-2">Save</button>
        </div>
    );
};
export default Editor;