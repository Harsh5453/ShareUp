import { useState } from 'react'
import itemsApi from '../../api/items.api'
import toast from 'react-hot-toast'

export default function AddItem() {
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    const form = e.target

    const data = {
      name: form.name.value,
      description: form.description.value,
      price: form.price.value,
      pickupAddress: form.pickupAddress.value
    }

    const image = form.image.files[0]

    try {
      setLoading(true)

      const res = await itemsApi.createItem(data)
      const itemId = res.data.id

      if (image) {
        await itemsApi.uploadImage(itemId, image)
      }

      toast.success('Item added successfully')
      form.reset()
    } catch (err) {
      console.error(err)
      toast.error('Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>

      <form onSubmit={submit} className="space-y-3">
        <input name="name" placeholder="Item name" required className="border p-2 w-full rounded" />
        <textarea name="description" placeholder="Description" required className="border p-2 w-full rounded" />
        <input name="price" type="number" placeholder="Price per day" required className="border p-2 w-full rounded" />

        <input
          name="pickupAddress"
          placeholder="Pickup Address"
          required
          className="border p-2 w-full rounded"
        />

        <input name="image" type="file" accept="image/*" />

        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  )
}
