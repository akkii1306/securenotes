const NoteList = ({notes, onSelect})=> (
    <div className="p-4">
        {notes.map((n,idx)=>(
            <button key={idx} onClick={()=>
                onSelect(n)} className="block p-2 bg-gray-100 w-full mb-2 text-left rounded">
                    Note{idx+1}
                </button>
        ))}
    </div>
);
export default NoteList;