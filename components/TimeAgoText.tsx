'use client'
import React from 'react'
import ReactTimeago from 'react-timeago';

function TimeAgoText({ date }: { date: string }) {
  return (
    <ReactTimeago date={date} />
  )
}

export default TimeAgoText