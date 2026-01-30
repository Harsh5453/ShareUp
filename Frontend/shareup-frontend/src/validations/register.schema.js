import * as yup from 'yup'

export default yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(6).required('Password is required'),
  role: yup.string().oneOf(['OWNER', 'BORROWER']).required()
})
