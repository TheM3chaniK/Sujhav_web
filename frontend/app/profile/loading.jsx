import { Loader2 } from "lucide-react"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto" />
        <p className="text-gray-400">Loading profile...</p>
      </div>
    </div>
  )
}
