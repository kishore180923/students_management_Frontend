import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentForm = ({ fetchStudents, editingStudent, setEditingStudent, onClose }) => {
  const [form, setForm] = useState({
    admissionNumber: '',
    name: '',
    email: '',
    mobileNumber: '',
    department: '',
    year: '',
    dob: '',
    gender: '',
    address: '',
    guardianContact: '',
    photo: null,
    documents: [],
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Allowed document types
  const allowedDocumentTypes = ['application/pdf'];

  useEffect(() => {
    if (editingStudent) {
      const formattedStudent = {
        ...editingStudent,
        dob: editingStudent.dob ? new Date(editingStudent.dob).toISOString().split('T')[0] : '',
        documents: [],
      };
      setForm(formattedStudent);
      if (editingStudent.photo) {
        setPreview(`http://localhost:5000${editingStudent.photo}`);
      }
    } else {
      resetForm();
    }
  }, [editingStudent]);

  const resetForm = () => {
    setForm({
      admissionNumber: '',
      name: '',
      email: '',
      mobileNumber: '',
      department: '',
      year: '',
      dob: '',
      gender: '',
      address: '',
      guardianContact: '',
      photo: null,
      documents: [],
    });
    setPreview(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      const file = files[0];
      setForm({ ...form, [name]: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const invalidFiles = files.filter(file => !allowedDocumentTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Only PDF documents are allowed');
      toast.error('Only PDF documents are allowed', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }

    // Add new documents to form state
    setForm(prev => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
    setError('');
  };

  const removeDocument = (index) => {
    setForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    setError('');

    const requiredFields = [
      'admissionNumber', 'name', 'email', 'mobileNumber',
      'department', 'year', 'dob', 'gender', 'address',
    ];
    
    const missingFields = requiredFields.filter(field => !form[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!/^\d{10}$/.test(form.mobileNumber)) {
      setError('Mobile number must be 10 digits.');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Invalid email format.');
      return false;
    }

    if (form.guardianContact && !/^\d{10}$/.test(form.guardianContact)) {
      setError('Guardian contact must be 10 digits if provided.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(error, { position: 'top-center', autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'documents') {
        form[key].forEach(file => {
          formData.append('documents', file);
        });
      } else if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editingStudent) {
        await axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Student updated successfully!', { position: 'top-center', autoClose: 3000 });
      } else {
        await axios.post('http://localhost:5000/api/students', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Student added successfully!', { position: 'top-center', autoClose: 3000 });
      }

      fetchStudents();
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      toast.error(err.response?.data?.message || 'Something went wrong', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admission Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="admissionNumber"
                    value={form.admissionNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    pattern="\d{10}"
                    placeholder="10 digit number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 space-x-4">
                    {['Male', 'Female', 'Other'].map(gender => (
                      <label key={gender} className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={form.gender === gender}
                          onChange={handleChange}
                          required
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                  </select>
                </div>



                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guardian Contact
                  </label>
                  <input
                    type="tel"
                    name="guardianContact"
                    value={form.guardianContact}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Photo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Photo
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Choose File
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>
                    <span className="ml-2 text-sm text-gray-500">
                      {form.photo ? form.photo.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
                {preview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 mb-1">Photo Preview:</p>
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Documents (PDF only)
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Choose Files
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleDocumentUpload}
                        className="sr-only"
                      />
                    </label>
                    <span className="ml-2 text-sm text-gray-500">
                      {form.documents.length > 0 ? `${form.documents.length} files selected` : 'No files chosen'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Upload academic certificates, ID proof, etc. (Max 5MB per file)
                  </p>
                </div>
                {form.documents.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 mb-2">Selected Documents:</p>
                    <ul className="space-y-2">
                      {form.documents.map((doc, index) => (
                        <li key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {doc.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {editingStudent?.documents?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">Previously Uploaded Documents:</p>
                    <ul className="space-y-2">
                      {editingStudent.documents.map((doc, index) => (
                        <li key={index} className="flex items-center bg-white p-2 rounded border border-gray-200">
                          <svg className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <a
                            href={`http://localhost:5000/api/students/${editingStudent._id}/document/${doc._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate max-w-xs"
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
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : editingStudent ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;