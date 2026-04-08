import * as yup from 'yup'

export default yup.object({
  name:     yup.string().required('Name is required'),
  email:    yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role:     yup.string().oneOf(['OWNER', 'BORROWER']).required(),
  phone:    yup.string().optional(),
  address:  yup.string().optional(), 
})
