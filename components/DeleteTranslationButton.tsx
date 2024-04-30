'use client'
import React from 'react'
import { Button } from './ui/button'
import { TrashIcon } from 'lucide-react'
import deleteTranslation from '@/actions/deleteTranslation'

function DeleteTranslationButton({ id } : { id: string }) {
    const deleteTranslationAction = deleteTranslation.bind(null, id);

  return (
    <form action={deleteTranslationAction}>
        <Button type='submit' variant='outline' size='icon'>
            <TrashIcon size={16} />
        </Button>
    </form>
  )
}

export default DeleteTranslationButton