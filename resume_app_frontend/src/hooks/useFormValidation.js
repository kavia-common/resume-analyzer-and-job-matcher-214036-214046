import { useState, useCallback } from 'react';

/**
 * PUBLIC_INTERFACE
 * A hook for managing form state, validation, and submission.
 *
 * @param {object} initialState - The initial state of the form fields.
 * @param {(values: object) => object} validate - A function that receives form values and returns an errors object.
 * @param {() => void} onSubmit - The callback function to execute on successful submission.
 * @returns {object} An object containing form handlers and state.
 */
function useFormValidation(initialState, validate, onSubmit) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value, files } = event.target;
    if (name === 'file') {
      setValues((prevValues) => ({
        ...prevValues,
        file: files ? files[0] : null,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitting(true);
      try {
        await onSubmit(values);
      } catch (e) {
        // Submission errors are handled in the component
      } finally {
        setSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setSubmitting(false);
  }, [initialState]);

  return {
    handleChange,
    handleSubmit,
    reset,
    values,
    errors,
    isSubmitting,
  };
}

export default useFormValidation;
