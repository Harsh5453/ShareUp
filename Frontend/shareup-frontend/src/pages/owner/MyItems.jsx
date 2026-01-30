import { useEffect, useState } from 'react'
import itemsApi from '../../api/items.api'
import toast from 'react-hot-toast'
import ItemCard from '../../components/ItemCard'
import Empty from '../../components/ui/Empty'

export default function MyItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await itemsApi.myItems()
        setItems(res.data)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load items')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (!loading && items.length === 0) {
    return <Empty text="You have not added any items yet." />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Items</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
