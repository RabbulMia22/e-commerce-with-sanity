import createImageUrlBuilder from '@sanity/image-url'
import imageUrlBuilder from '@sanity/image-url'
import {client} from "@/sanity/lib/client"
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = imageUrlBuilder(client)

export const imageUrl = (source: SanityImageSource) => {
  return builder.image(source)
}
