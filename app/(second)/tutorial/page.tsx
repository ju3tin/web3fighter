import { Suspense } from "react"
import TutorialPageClient from "@/components/tutorial-page-client"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading tutorial...</div>}>
      <TutorialPageClient />
    </Suspense>
  )
}