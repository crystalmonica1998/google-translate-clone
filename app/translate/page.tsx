import React from 'react'
import { auth } from '@clerk/nextjs/server'
import TranslationForm from '@/components/TranslationForm';
import TranslationHistory from '@/components/TranslationHistory';

export type TranslationLanguages = {
    translation: {
        [key:string]: {
            name: string;
            nativeName: string;
            dir: 'ltr' | 'rtl';
        }
    }
}

async function Translate() {
    auth().protect();

    const { userId } = auth();
    if(!userId) throw new Error('User not logged in');

    const languagesEndpoint = 'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0';

    const response = await fetch(languagesEndpoint, {
        next: {
            revalidate: 60 * 60 * 24 // Cache the result for 24 hrs then refresh
        }
    })

    const languages = await response.json() as TranslationLanguages;

  return (
    <div className='px-10 xl:px-0 mb-20'>
        <TranslationForm languages={languages} />

        <TranslationHistory />
    </div>
  )
}

export default Translate