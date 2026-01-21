"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Trophy, Medal, Award, Star, Plus, Loader2, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import Image from "next/image"

// Helper function to transform achievement data from API to component format
function transformAchievementData(achievement) {
  // Map achievement type to icon
  const iconMap = {
    JEE_ADVANCED: Trophy,
    JEE_MAIN: Trophy,
    NEET: Medal,
    BOARD_EXAM: Star,
    SCHOLARSHIP: Award,
    COMPETITION: Award,
    OTHER: Award,
  }

  // Map achievement type to color gradient
  const colorMap = {
    JEE_ADVANCED: "from-yellow-500 to-yellow-600",
    JEE_MAIN: "from-blue-500 to-blue-600",
    NEET: "from-green-500 to-green-600",
    BOARD_EXAM: "from-purple-500 to-purple-600",
    SCHOLARSHIP: "from-red-500 to-red-600",
    COMPETITION: "from-indigo-500 to-indigo-600",
    OTHER: "from-gray-500 to-gray-600",
  }

  // Construct achievement text
  let achievementText = achievement.title
  if (achievement.rank) {
    achievementText = `${achievement.examName || achievement.title} AIR ${achievement.rank}`
  } else if (achievement.percentile) {
    achievementText = `${achievement.examName || achievement.title} ${achievement.percentile} Percentile`
  }

  return {
    id: achievement.id,
    studentName: achievement.user?.fullName || "Student",
    achievement: achievementText,
    year: String(achievement.year),
    course: achievement.examName || achievement.description || "Achievement",
    photo: achievement.imageUrl || "/placeholder.svg?height=300&width=300",
    icon: iconMap[achievement.type] || Award,
    color: colorMap[achievement.type] || "from-gray-500 to-gray-600",
  }
}

export default function PhotoGallery() {
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // State for fetched data
  const [photos, setPhotos] = useState([])
  const [achievements, setAchievements] = useState([])
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false)
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(false)
  const [photosError, setPhotosError] = useState(null)
  const [achievementsError, setAchievementsError] = useState(null)

  // Refs to track current AbortControllers
  const galleryControllerRef = useRef(null)
  const achievementsControllerRef = useRef(null)

  // Top-level function to load gallery images
  const loadGallery = async (signal) => {
    if (signal?.aborted) return
    setIsLoadingPhotos(true)
    setPhotosError(null)
    try {
      const res = await fetch("/api/gallery", { cache: "no-store", signal })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch gallery images")
      }

      // Check if aborted before setting state
      if (signal?.aborted) return

      // Validate and transform data
      if (data.images && Array.isArray(data.images)) {
        const transformedPhotos = data.images.map((img) => ({
          id: img.id,
          src: img.imageUrl || "/placeholder.svg",
          title: img.title || "Gallery Image",
        }))
        setPhotos(transformedPhotos)
      } else {
        setPhotos([])
      }
    } catch (error) {
      if (signal?.aborted) return
      console.error("Error fetching gallery images:", error)
      setPhotosError(error.message || "Unable to load gallery images. Please try again later.")
    } finally {
      if (!signal?.aborted) {
        setIsLoadingPhotos(false)
      }
    }
  }

  // Top-level function to load achievements
  const loadAchievements = async (signal) => {
    if (signal?.aborted) return
    setIsLoadingAchievements(true)
    setAchievementsError(null)
    try {
      const res = await fetch("/api/achievements", { cache: "no-store", signal })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch achievements")
      }

      // Check if aborted before setting state
      if (signal?.aborted) return

      // Validate and transform data
      if (data.achievements && Array.isArray(data.achievements)) {
        const transformedAchievements = data.achievements.map(transformAchievementData)
        setAchievements(transformedAchievements)
      } else {
        setAchievements([])
      }
    } catch (error) {
      if (signal?.aborted) return
      console.error("Error fetching achievements:", error)
      setAchievementsError(error.message || "Unable to load achievements. Please try again later.")
    } finally {
      if (!signal?.aborted) {
        setIsLoadingAchievements(false)
      }
    }
  }

  // Handler for gallery retry
  const handleGalleryRetry = () => {
    const controller = new AbortController()
    galleryControllerRef.current = controller
    loadGallery(controller.signal)
  }

  // Handler for achievements retry
  const handleAchievementsRetry = () => {
    const controller = new AbortController()
    achievementsControllerRef.current = controller
    loadAchievements(controller.signal)
  }

  // Fetch gallery images on component mount
  useEffect(() => {
    const controller = new AbortController()
    galleryControllerRef.current = controller
    loadGallery(controller.signal)
    return () => {
      controller.abort()
      if (galleryControllerRef.current) {
        galleryControllerRef.current.abort()
      }
    }
  }, [])

  // Fetch achievements on component mount
  useEffect(() => {
    const controller = new AbortController()
    achievementsControllerRef.current = controller
    loadAchievements(controller.signal)
    return () => {
      controller.abort()
      if (achievementsControllerRef.current) {
        achievementsControllerRef.current.abort()
      }
    }
  }, [])

  // Show first 8 photos initially, rest on load more
  const initialPhotosCount = 8
  const displayedPhotos = showAllPhotos ? photos : photos.slice(0, initialPhotosCount)

  const handleLoadMore = async () => {
    setIsLoading(true)
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowAllPhotos(true)
    setIsLoading(false)
  }

  const openPhotoModal = (photo, index) => {
    setSelectedPhoto(photo)
    setCurrentPhotoIndex(index)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
    setCurrentPhotoIndex(0)
  }

  const navigatePhoto = (direction) => {
    const totalPhotos = displayedPhotos.length
    let newIndex

    if (direction === "next") {
      newIndex = currentPhotoIndex === totalPhotos - 1 ? 0 : currentPhotoIndex + 1
    } else {
      newIndex = currentPhotoIndex === 0 ? totalPhotos - 1 : currentPhotoIndex - 1
    }

    setCurrentPhotoIndex(newIndex)
    setSelectedPhoto(displayedPhotos[newIndex])
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") navigatePhoto("next")
    if (e.key === "ArrowLeft") navigatePhoto("prev")
    if (e.key === "Escape") closePhotoModal()
  }

  return (
    <section className="py-20 relative overflow-hidden section-transition-top">
      {/* Background with subtle darker starting gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black-900/100 via-gray-950/70 to-gray-900/30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/4 via-transparent to-green-500/4"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-green-600/3 via-transparent to-green-400/3"></div>

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/7 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-green-400/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-300/4 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-green-600/4 rounded-full blur-2xl animate-pulse-slow delay-1500"></div>
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-green-500/6 rounded-full blur-xl animate-pulse-slow delay-2000"></div>
        <div className="absolute bottom-10 right-1/2 w-56 h-56 bg-green-400/5 rounded-full blur-2xl animate-pulse-slow delay-2500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-4 py-2">Photo Collection</Badge>
          <h2 className="text-4xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              SUJHAV Gallery
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore our campus, witness our vibrant life, and experience the SUJHAV journey through these moments
          </p>
        </div>

        {/* Photo Grid - Initially showing limited photos */}
        <div className="space-y-8 mb-20">
          {isLoadingPhotos ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-green-400" />
            </div>
          ) : photosError ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-red-400 text-lg">{photosError}</p>
              <Button
                onClick={handleGalleryRetry}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold"
              >
                Retry
              </Button>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-gray-400 text-lg">No gallery images yet.</p>
              <p className="text-gray-500 text-sm">Check back soon for photos from our campus and events!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {displayedPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-lg group cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/20"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                onClick={() => openPhotoModal(photo, index)}
              >
                <Image
                  src={photo.src || "/placeholder.svg"}
                  alt={photo.title || `SUJHAV Photo ${photo.id}`}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                </div>
                {/* Photo title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                </div>
              </div>
                ))}
              </div>

              {/* Load More Button */}
              {!showAllPhotos && photos.length > initialPhotosCount && (
                <div className="text-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading More Photos...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Load More Photos ({photos.length - initialPhotosCount} remaining)
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Show total count when all photos are loaded */}
              {showAllPhotos && (
                <div className="text-center">
                  <p className="text-green-400 font-medium">Showing all {photos.length} photos from our gallery</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Achievements Section */}
        <div className="space-y-12">
          <div className="text-center space-y-6">
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 px-4 py-2 mt-8">
              <Trophy className="w-4 h-4 mr-2" />
              Our Achievements
            </Badge>
            <h3 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Celebrating the remarkable achievements of our students who have made us proud
            </p>
          </div>

          {/* Achievements Container */}
          {isLoadingAchievements ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
            </div>
          ) : achievementsError ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-red-400 text-lg">{achievementsError}</p>
              <Button
                onClick={handleAchievementsRetry}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
              >
                Retry
              </Button>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-gray-400 text-lg">No achievements to display.</p>
              <p className="text-gray-500 text-sm">Stay tuned for our students' success stories!</p>
            </div>
          ) : (
            <>
              <div className="relative overflow-hidden">
                <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
                  {achievements.map((achievement) => {
                    const IconComponent = achievement.icon
                    return (
                      <Card
                        key={achievement.id}
                        className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-500 shadow-2xl hover:shadow-green-500/10"
                      >
                        <CardContent className="p-6 space-y-6">
                          {/* Large Square Photo */}
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-green-500/30">
                            <Image
                              src={achievement.photo || "/placeholder.svg"}
                              alt={achievement.studentName}
                              fill
                              className="object-cover"
                            />
                            {/* Achievement Icon Overlay */}
                            <div className="absolute top-3 right-3">
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-lg`}
                              >
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Student Information */}
                          <div className="text-center space-y-4">
                            <h4 className="text-2xl font-bold text-green-400">{achievement.studentName}</h4>

                            <div className="space-y-3">
                              <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-lg border border-green-500/20">
                                <p className="text-lg font-bold text-green-300 mb-1">{achievement.achievement}</p>
                                <p className="text-sm text-gray-400">Year {achievement.year}</p>
                              </div>

                              <div className="p-3 bg-white/5 rounded-lg border border-green-500/10">
                                <p className="text-sm font-medium text-gray-300">{achievement.course}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center">
                <p className="text-sm text-gray-500">Scroll horizontally to explore all achievements.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => { if (!open) closePhotoModal() }}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-full h-full bg-black border-none p-0 overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">
            {selectedPhoto?.title || `Photo ${currentPhotoIndex + 1} of ${displayedPhotos.length}`}
          </DialogTitle>
          {selectedPhoto && (
            <div className="relative w-full h-full">
              {/* Close Button */}
              <DialogClose className="absolute top-4 right-4 z-50 rounded-full bg-black/70 backdrop-blur-sm p-2 text-white hover:bg-black/90 transition-colors duration-300 border border-white/20">
                <X className="h-6 w-6" />
              </DialogClose>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigatePhoto("prev")}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 rounded-full bg-black/70 backdrop-blur-sm p-3 text-white hover:bg-black/90 transition-all duration-300 hover:scale-110 border border-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() => navigatePhoto("next")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 rounded-full bg-black/70 backdrop-blur-sm p-3 text-white hover:bg-black/90 transition-all duration-300 hover:scale-110 border border-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Main Image - Full Size */}
              <div className="w-full h-full">
                <Image
                  src={selectedPhoto.src || "/placeholder.svg"}
                  alt={selectedPhoto.title || `SUJHAV Photo ${selectedPhoto.id}`}
                  fill
                  className="object-cover"
                  sizes="95vw"
                  priority
                />
              </div>

              {/* Photo Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-green-400">{selectedPhoto.title}</h3>
                  <p className="text-gray-300">
                    Photo {currentPhotoIndex + 1} of {displayedPhotos.length}
                  </p>
                </div>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm border border-white/20">
                <p className="mb-1">Use arrow keys to navigate</p>
                <p>Press ESC to close</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
