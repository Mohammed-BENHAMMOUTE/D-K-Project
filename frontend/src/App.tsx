import './App.css'
import { DataTable } from './components/myComponents/DataTable'
import { columns } from './components/myComponents/columns'
import { AddStudentModal } from './components/myComponents/AddStudentModal'
import type { Student } from './components/myComponents/columns'
import { useState } from 'react'
import { GradesModal } from './components/myComponents/GradesModal'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null)
  
  const [data, setData] = useState<Student[]>([
    { id: "1", name: "Student 1", created: "2024-01-01" },
    { id: "2", name: "Student 2", created: "2024-01-02" },
    { id: "3", name: "Student 3", created: "2024-01-03" },
    { id: "4", name: "Student 4", created: "2024-01-04" },
    { id: "5", name: "Student 5", created: "2024-01-05" },
    { id: "6", name: "Student 6", created: "2024-01-06" },
    { id: "7", name: "Student 7", created: "2024-01-07" },
    { id: "8", name: "Student 8", created: "2024-01-08" },
    { id: "9", name: "Student 9", created: "2024-01-09" },
    { id: "10", name: "Student 10", created: "2024-01-10" },
  ])

  const handleAddStudent = (name: string) => {
    const newStudent: Student = {
      id: (data.length + 1).toString(),
      name,
      created: new Date().toISOString().split('T')[0]
    }
    setData([...data, newStudent])
  }

  const handleRowClick = (student: Student) => {
    setSelectedStudent({ id: student.id, name: student.name })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold text-blue-600">SMS</h2>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Students</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Reports</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Management System</h1>
              <p className="mt-2 text-sm text-gray-500">Manage and track student records efficiently</p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add New Student
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 py-5 sm:p-6">
            <DataTable 
              columns={columns} 
              data={data} 
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </main>

      <AddStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStudent}
      />
      
      <GradesModal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        studentId={selectedStudent?.id ?? null}
        studentName={selectedStudent?.name ?? ''}
      />
    </div>
  )
}

export default App
