import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteProps{
  onNoteCreated: (content: string) => void
}

let speechRecognition : SpeechRecognition | null = null

export function NewNoteCard({onNoteCreated}: NewNoteProps){
  const [isRecording,setIsRecording] = useState(false)
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState('')

  function handleStartEditor(){
      setShouldShowOnboarding(false)
  }
  
  function handleContentChanged(event:ChangeEvent<HTMLTextAreaElement>){
    setContent(event.target.value)

    if(event.target.value === ''){
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event:FormEvent){
    event.preventDefault();
    if(content === ''){
      return
    }
    onNoteCreated(content);
    setContent('');
    setShouldShowOnboarding(true);
    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording(){
    

    const isSpeechRecognitionApiAvailable = 'SpeechRecognition' in window
    || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionApiAvailable){
      alert('Infelizmente seu navegador não suporta API de gravação!')
      return
    }
    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

   speechRecognition = new SpeechRecognitionAPI() 

    speechRecognition.lang = 'pt-br'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const trasncription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(trasncription)
    }
    

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording(){
    setIsRecording(false)
    if(speechRecognition !== null){
      speechRecognition.stop();
    }
  }

  return(
    <Dialog.Root>
    <Dialog.Trigger className='rounded-md flex flex-col text-left bg-slate-700 p-5 gap-3 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
      <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
        <p className='text-sm leading-6 text-slate-400'>
              Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
    </Dialog.Trigger>
    <Dialog.Portal>   
    <Dialog.Overlay className="inset-0 fixed bg-black/50"/> 
    <Dialog.Content  className="fixed overflow-hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full inset-0 md:inset-auto bg-slate-700 md:rounded-md outline-none flex flex-col">
      <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
        <X className="size-5" /> 
      </Dialog.Close>
      <form className="flex-1 flex flex-col" action="" >
      <div className="flex flex-1 flex-col gap-3 p-5">
      <span className="text-sm font-medium text-slate-300">
        Adicionar Nota</span>

        {
        shouldShowOnboarding ? (
          <p className="text-sm leading-6 text-slate-400">
          Comece {' '}
          <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline"> gravando uma nota</button> em áudio ou se preferir {''}
          <button type="button" className="font-medium text-lime-400 hover:underline" onClick={handleStartEditor}> utilize apenas texto</button>.
         </p>
        )
        :
        (
          <textarea 
          value={content}
          onChange={handleContentChanged} autoFocus className="text-sm text-slate-400 resize-none flex-1 bg-transparent outline-none">


          </textarea>
        )
      }
      </div>

      {isRecording ? (
      <button type="button" onClick={handleStopRecording} className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center font-medium text-sm text-slate-300 outline-none group hover:text-slate-100">
        <div className="size-3 animate-ping rounded-full bg-red-500"/>
        Gravando ! (clique p/ interromper)
      </button>
      )
        :
        (
      <button onClick={handleSaveNote} type="button" className="w-full bg-lime-400 py-4 text-center font-medium text-sm text-lime-950 outline-none group hover:bg-lime-500">
        Salvar nota
      </button>
        )
    }

      
      </form>
    </Dialog.Content>
    </Dialog.Portal>

    </Dialog.Root>
  )
}