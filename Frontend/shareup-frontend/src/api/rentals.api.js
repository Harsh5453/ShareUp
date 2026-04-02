import rentalAxios from './rentalAxios'

export default {
  // Borrower — submit rental request with dates
  request: data => rentalAxios.post('/api/rentals/request', data),

  // Borrower — cancel a PENDING request
  cancel: id => rentalAxios.put(`/api/rentals/${id}/cancel`),

  // Owner — approve / reject
  approve: id => rentalAxios.put(`/api/rentals/approve/${id}`),
  reject:  id => rentalAxios.put(`/api/rentals/reject/${id}`),

  // Borrower — my rentals list
  myRentals: () => rentalAxios.get('/api/rentals/me'),

  // Owner — incoming requests
  getOwnerRequests: () => rentalAxios.get('/api/rentals/owner'),

  // Owner — pending return approvals
  getPendingReturns: () => rentalAxios.get('/api/rentals/owner/returns'),

  // Borrower — submit return with image proof
  returnItem: (id, file) => {
    const fd = new FormData()
    fd.append('image', file)
    return rentalAxios.post(`/api/rentals/${id}/return`, fd)
  },

  // Owner — approve return
  approveReturn: id => rentalAxios.put(`/api/rentals/approve-return/${id}`),
}