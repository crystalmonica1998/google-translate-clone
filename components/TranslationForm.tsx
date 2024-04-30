'use client'
import { TranslationLanguages } from '@/app/translate/page'
import React, { useEffect, useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
  } from "@/components/ui/select"
  import { Textarea } from '@/components/ui/textarea'
import { useFormState } from 'react-dom'
import translate from '@/actions/translate'
import Image from 'next/image'
import SubmitButton from './SubmitButton'
import { Button } from './ui/button'
import { Volume2Icon } from 'lucide-react'
import Recorder from './Recorder'

const initialState = {
    inputLanguage: 'auto',
    input: '',
    outputLanguage: 'es',
    output: ''
}
export type State = typeof initialState;

function TranslationForm({ languages } : { languages: TranslationLanguages }) {
    const [state, formAction] = useFormState(translate, initialState);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const submitBtnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(!input.trim()) return;

        const delayDebounceFn = setTimeout(() => {
            submitBtnRef.current?.click();
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [input]);

    useEffect(() => {
        if(state.output) {
            setOutput(state.output)
        }
    }, [state]);

    const uploadAudio = async (blob: Blob) => {
        const mimeType = 'audio/webm';

        const file = new File([blob], mimeType, { type: mimeType });

        const formData = new FormData();
        formData.append('audio', file);

        const response = await fetch('/transcribeAudio', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if(data.text) {
            setInput(data.text);
        }
    }

    const playAudio = async () => {
        const synth = window.speechSynthesis;

        if(!output || !synth) return;

        const wordsToSay = new SpeechSynthesisUtterance(output);
        synth.speak(wordsToSay);
    };

  return (
    <div>
        <form action={formAction}>
            <div className='flex items-start space-x-2 mb-5'>
                <div className='flex items-center group cursor-pointer border rounded-md w-fit px-3 py-2 bg-[#E7F0FE]'>
                    <Image
                        src='https://links.papareact.com/r9c'
                        alt='logo'
                        width={30}
                        height={30}
                    />
                    <p className='text-sm font-medium text-blue-500 group-hover:underline ml-2 mt-1'>
                        Text
                    </p>
                </div>

                <Recorder uploadAudio={uploadAudio} />
            </div>
        
            <div className='flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2'>
                <div className='flex-1 space-y-2'>
                        <Select name='input-language' defaultValue='auto'>
                            <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        Want us to figure it out?
                                    </SelectLabel>
                                    <SelectItem key="auto" value="auto">
                                        Auto-Detection
                                    </SelectItem>
                                </SelectGroup>

                                <SelectGroup>
                                    <SelectLabel>
                                        Language
                                    </SelectLabel>

                                    {Object.entries(languages.translation).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    <Textarea
                        placeholder='Type your message here.'
                        className='min-h-32 text-xl'
                        name='input'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                <div className='flex-1 space-y-2'>
                    <div className='flex items-center justify-between'>
                        <Select name='output-language' defaultValue='es'>
                            <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        Want us to figure it out?
                                    </SelectLabel>
                                    <SelectItem key="auto" value="auto">
                                        Auto-Detection
                                    </SelectItem>
                                </SelectGroup>

                                <SelectGroup>
                                    <SelectLabel>
                                        Language
                                    </SelectLabel>

                                    {Object.entries(languages.translation).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Button
                            variant='ghost'
                            type='button'
                            onClick={playAudio}
                            disabled={!output}>
                            <Volume2Icon 
                                size={24}
                                className='text-blue-500 cursor-pointer disabled:cursor-not-allowed'
                            />
                        </Button>
                    </div>

                    <Textarea
                        placeholder='Type your message here.'
                        className='min-h-32 text-xl'
                        name='output'
                        value={output}
                        onChange={(e) => setOutput(e.target.value)}
                    />
                </div>
            </div>

            <div className='mt-5 flex justify-end'>
                <SubmitButton disabled={!input} />
                <button type='submit' ref={submitBtnRef} hidden />
            </div>
        </form>
    </div>
  )
}

export default TranslationForm