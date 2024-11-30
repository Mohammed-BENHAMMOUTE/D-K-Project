
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"

interface Grade {
  name: string
  score: number
}

interface GradesModalProps {
  isOpen: boolean
  onClose: () => void
  studentId: string | null
  studentName: string
}

export function GradesModal({ isOpen, onClose, studentId, studentName }: GradesModalProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && studentId) {
      setLoading(true)
      fetch(`/students/search/findByIdWithGrades?id=${studentId}`)
        .then(res => res.json())
        .then(data => {
          setGrades(data.grades || [])
          setError(null)
        })
        .catch(() => {
          setError("Failed to load grades")
          setGrades([])
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, studentId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{studentName}'s Grades</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <p className="text-center">Loading grades...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : grades.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell>{grade.name}</TableCell>
                    <TableCell>{grade.score.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500">No grades available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}