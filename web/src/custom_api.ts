import { FileWrapper } from './components/@diffrag/form/fields/FormFileField'

export const customApi = {
  uploadImage: async ({ file, crop }: FileWrapper) => {
    const formData = new FormData()
    formData.append('images', file)

    if (crop) {
      formData.append('crops', JSON.stringify([crop]))
    }
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/assets/images/upload`,
      {
        body: formData,
        method: 'POST',
      },
    )

    const data = await res.json()

    return data
  },
}
