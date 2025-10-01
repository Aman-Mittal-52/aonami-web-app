import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

function NotFound() {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <h1>404 Not Found</h1>
        <p className="text-muted-foreground">The page you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate('/')} variant="outline">Back to Dashboard</Button>
    </div>
  )
}

export default NotFound 