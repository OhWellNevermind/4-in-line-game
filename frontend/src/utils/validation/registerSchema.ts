import * as yup from 'yup';

const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default registerSchema;
