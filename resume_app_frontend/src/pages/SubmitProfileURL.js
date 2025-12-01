import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Stepper from '../components/Stepper';
import Button from '../components/Button';
import { api } from '../services/api';
import useFormValidation from '../hooks/useFormValidation';

const validateUrl = (values) => {
  const errors = {};
  if (!values.url) {
    errors.url = 'Profile URL is required.';
  } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(values.url)) {
    errors.url = 'Please enter a valid URL.';
  }
  return errors;
};

/**
 * PUBLIC_INTERFACE
 * SubmitProfileURL: Submits a profile URL to be analyzed (LinkedIn, etc.)
 */
function SubmitProfileURL() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const submit = async (values) => {
    setApiError('');
    try {
      const response = await api.submitProfileURL(values.url);
      const analysisId = response?.analysis_id;
      if (!analysisId) throw new Error('Did not receive analysis ID.');
      toast.success('Profile URL submitted successfully!');
      navigate(`/status/${encodeURIComponent(analysisId)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setApiError(message);
      toast.error(message);
    }
  };
  
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    isSubmitting,
  } = useFormValidation({ url: '' }, validateUrl, submit);

  return (
    <div>
      <Stepper steps={['Upload/URL', 'Analyze', 'Results', 'Suggestions', 'Jobs']} current={0} />
      <Card title="Submit Profile URL" subtitle="We’ll fetch your profile details and start the analysis.">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <label htmlFor="url">Profile URL</label>
            <input 
              id="url" 
              name="url" 
              type="url" 
              placeholder="https://www.linkedin.com/in/..." 
              required 
              value={values.url} 
              onChange={handleChange}
              aria-describedby={errors.url ? "url-error" : undefined}
            />
            {errors.url && <p id="url-error" className="form-error">{errors.url}</p>}
          </div>
          {apiError && <p className="form-error" style={{ margin: '0 0 12px' }}>Error: {apiError}</p>}
          <Button type="submit" loading={isSubmitting}>
            Start Analysis
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default SubmitProfileURL;
