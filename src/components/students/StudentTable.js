import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentTable = ({ students, setEditingStudent, deleteStudent }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/50?text=No+Photo';
    e.target.className = 'h-12 w-12 bg-gray-200 mx-auto';
  };

  const toggleDropdown = (studentId) => {
    setDropdownOpen(dropdownOpen === studentId ? null : studentId);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
    setDropdownOpen(null);
  };

  const confirmDelete = async () => {
    try {
      await deleteStudent(studentToDelete._id);
      setShowDeleteModal(false);
      toast.success('Student deleted successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error deleting student', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  const handleViewClick = (student) => {
    setViewingStudent(student);
    setShowViewModal(true);
    setDropdownOpen(null);
  };

  const handleDownloadStudentData = async (student) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${student._id}/download`);
      if (!response.ok) throw new Error('Failed to download student data');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${student.admissionNumber}_data.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded data for ${student.name}`, {
        position: 'top-center',
        autoClose: 2000,
      });
    } catch (error) {
      toast.error('Error downloading student data', {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="relative ">
      {/* View Student Modal */}
      {showViewModal && viewingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Student Details
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 flex justify-center">
                  {viewingStudent.photo ? (
                    <img
                      src={`http://localhost:5000${viewingStudent.photo}`}
                      alt="student"
                      className="h-40 w-40 rounded-full object-cover border-4 border-blue-100 shadow-md"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="h-40 w-40 rounded-full bg-gray-100 flex items-center justify-center border-4 border-blue-100 shadow-md">
                      <span className="text-lg text-gray-500">No Photo</span>
                    </div>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-semibold text-blue-600">
                        {viewingStudent.name}
                      </h4>
                      <p className="text-gray-600">{viewingStudent.admissionNumber}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Department</p>
                        <p className="font-medium">{viewingStudent.department}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Year</p>
                        <p className="font-medium">{viewingStudent.year}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="font-medium">{viewingStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Mobile</p>
                        <p className="font-medium">{viewingStudent.mobileNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p className="font-medium">
                          {new Date(viewingStudent.dob).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p className="font-medium">{viewingStudent.gender}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="font-medium">{viewingStudent.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Guardian Contact</p>
                      <p className="font-medium">{viewingStudent.guardianContact || 'N/A'}</p>
                    </div>
                    {viewingStudent.documents?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Documents</p>
                        <ul className="space-y-2">
                          {viewingStudent.documents.map((doc, index) => (
                            <li key={index} className="flex items-center">
                              <svg className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                              <a
                                href={`http://localhost:5000/api/students/${viewingStudent._id}/document/${doc._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {doc.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingStudent(viewingStudent);
                    setShowViewModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Student
                </button>
                <button
                  onClick={() => handleDownloadStudentData(viewingStudent)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Download All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {studentToDelete?.name} (Admission No: {studentToDelete?.admissionNumber})?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-indigo-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">S.No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Admission No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Photo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Year</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Documents</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 uppercase">
                  {student.admissionNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center">
                    {student.photo ? (
                      <img
                        src={`http://localhost:5000${student.photo}`}
                        alt="student"
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                        <span className="text-xs text-gray-500">No Photo</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {student.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {student.year}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {student.mobileNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.documents?.length > 0 ? (
                    <ul className="space-y-1">
                      {student.documents.map((doc, idx) => (
                        <li key={idx}>
                          <a
                            href={`http://localhost:5000/api/students/${student._id}/document/${doc._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {doc.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No documents</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownloadStudentData(student)}
                      className="p-1.5 rounded-md bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                      title="Download All Data"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleDropdown(student._id)}
                      className="p-1.5 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  {dropdownOpen === student._id && (
                    <div className="origin-top-right absolute right-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <button
                          onClick={() => handleViewClick(student)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setDropdownOpen(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                          role="menuitem"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-600">No students found</p>
                  <p className="text-sm text-gray-500 mt-1">Add a new student to get started</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;