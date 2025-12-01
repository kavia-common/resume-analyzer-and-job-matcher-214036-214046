import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import Button from '../components/Button';
import { api } from '../services/api';
import useFormValidation from '../hooks/useFormValidation';

const MAX_FILE_SIZE_MB = 5;
const SUPPORTED_FORMATS = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

const validateFile = (values) => {
  const errors = {};
  if (!values.file) {
    errors.file = 'Please select a resume file.';
  } else {
    // Loosening the check to account for different system MIME types
    const isSupported = SUPPORTED_FORMATS.includes(values.file.type) || values.file.name.endsWith('.pdf') || values.file.name.endsWith('.docx') || values.file.name.endsWith('.doc');
    if (!isSupported) {
      errors.file = 'Invalid file format. Please upload a PDF, DOC, or DOCX.';
    }
    if (values.file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      errors.file = `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }
  }
  return errors;
};

/**
 * PUBLIC_INTERFACE
 * UploadResume: Allows users to upload a resume file and starts analysis task.
 */
function UploadResume() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const submit = async (values) => {
    setApiError('');
    try {
      const response = await api.uploadResume(values.file);
      const analysisId = response?.analysis_id;
      if (!analysisId) throw new Error('Did not receive analysis ID.');
      toast.success('Resume uploaded successfully!');
      navigate(`/status/${encodeURIComponent(analysisId)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setApiError(message);
      toast.error(message);
    }
  };
  
  const {
    handleChange,
    handleSubmit,
    errors,
    isSubmitting,
  } = useFormValidation({ file: null }, validateFile, submit);

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={0} />
      <Card title="Upload Resume" subtitle={`Supported formats: PDF, DOC, DOCX. Max size: ${MAX_FILE_SIZE_MB}MB.`}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="resume">Resume file</label>
            <input 
              id="resume" 
              name="file" // Name must match the key in useFormValidation state
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleChange}
              aria-describedby={errors.file ? "file-error" : undefined}
              aria-invalid={!!errors.file}
            />
            {errors.file && <p id="file-error" className="form-error">{errors.file}</p>}
          </div>
          {apiError && <p className="form-error" style={{ margin: '0 0 12px' }}>{apiError}</p>}
          <Button type="submit" loading={isSubmitting}>
            Start Analysis
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default UploadResume;
