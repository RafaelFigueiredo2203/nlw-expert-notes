import { ChangeEvent, useState } from 'react';
import logo from './assets/Logo.svg';
import { NewNoteCard } from './components/NewNoteCard';
import { NoteCard } from './components/NoteCard';

interface NoteProps {
  id:string
  date:Date
  content:string
}

export function App() {

  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<NoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    
    return []
  });

  

  function onNoteCreated(content:string){
    const newNote = {
      id:crypto.randomUUID(),
      date: new Date(),
      content,
    }


    const notesArray = [newNote,...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event:ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }
  
  const filteredNotes = search !== '' ?
  notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  : notes

  function onNoteDeleted(id:string){
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  return ( 
      <div className='mx-auto my-12 max-w-6xl space-y-6 px-5 '>
        <img src={logo} alt="NLW EXPERT" />

        <form className='w-full'>
          <input onChange={handleSearch} type="text" placeholder='Busque em suas notas...' 
          className='bg-transparent w-full text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none' />
        </form>

        <div className='h-px bg-slate-700'/>

        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 auto-rows-[250px]'>
          <NewNoteCard onNoteCreated={onNoteCreated}/>

            {filteredNotes.map(note => {
              return <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} notes={note}/>
            })}
        </div>  
      </div>
    )
}


