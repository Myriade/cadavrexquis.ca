import { drupal } from "./drupal"

async function fetchNodeMetadata(slug, { nodeType, pageLimit, extraFields = [] }) {
  try {
    // 1. Fetch all paths for this node type from Drupal
    const pathsResponse = await drupal.getResourceCollection(nodeType, {
      params: {
        "filter[field_site_visible]": 1,
        [`fields[${nodeType}]`]: "path,drupal_internal__nid",
        "page[limit]": pageLimit,
      },
      deserialize: false,
    })

    if (!pathsResponse || !pathsResponse.data) {
      return null
    }

    // 2. Find the resource UUID matching the given slug
    const node = pathsResponse.data.find(
      (n) => n.attributes?.path?.alias === `/${slug}`
    )

    if (!node) {
      return null
    }

    // 3. Fetch that single node with lightweight SEO fields
    const baseFields = ["title", "field_annees_de_sortie", "field_site_thematique", "field_site_photogramme"]
    const fields = [...baseFields, ...extraFields].join(",")

    const resource = await drupal.getResource(nodeType, node.id, {
      params: {
        [`fields[${nodeType}]`]: fields,
        include: "field_site_thematique,field_site_photogramme",
      },
    })

    if (!resource) {
      return null
    }

    // 4. Extract SEO-relevant data
    const title = resource.title
    const year = resource.field_annees_de_sortie
    const thematiques = resource.field_site_thematique?.map((t) => t.name) || []

    let imageUrl = null
    if (resource.field_site_photogramme?.uri?.url) {
      const baseUrl = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "").replace(/\/$/, "")
      imageUrl = `${baseUrl}${resource.field_site_photogramme.uri.url}`
    }

    return { title, year, thematiques, imageUrl }
  } catch (error) {
    console.error(`Error fetching ${nodeType} metadata:`, error)
    return null
  }
}

export const fetchFilmMetadata = (slug) =>
  fetchNodeMetadata(slug, { nodeType: "node--film", pageLimit: 400, extraFields: ["field_site_collection"] })

export const fetchDocumentMetadata = (slug) =>
  fetchNodeMetadata(slug, { nodeType: "node--article", pageLimit: 200 })
