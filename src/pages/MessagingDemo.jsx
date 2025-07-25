import React from 'react'
import MessagingSystem from '../components/MessagingSystem'

const MessagingDemo = () => {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      <div className="container mx-auto h-screen max-h-screen">
        <div className="p-4 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
          <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
            MNADA Messaging System Demo
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary mt-1">
            Complete messaging system with individual chats, group messaging, voice messages, threading, and file sharing
          </p>
        </div>
        
        <div className="h-[calc(100vh-100px)]">
          <MessagingSystem currentUserId={1} />
        </div>
      </div>
    </div>
  )
}

export default MessagingDemo
