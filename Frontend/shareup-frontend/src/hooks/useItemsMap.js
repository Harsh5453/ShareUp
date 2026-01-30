import { useEffect, useState } from 'react'
import itemsApi from '../api/items.api'

export default function useItemsMap() {
  const [map, setMap] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        const res = await itemsApi.getAll()
        const items = res.data || []

        const obj = {}
        items.forEach(i => {
          const id = i.id || i._id
          obj[id] = i.name
        })

        setMap(obj)
      } catch (err) {
        console.error('Failed to load items map', err)
      }
    }

    load()
  }, [])

  return map
}
